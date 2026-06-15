/* Superhero Stories offline service worker.
   Precaches the app shell + every page + assets so the app works in airplane mode.
   RSC (.txt) payloads are intentionally not precached: when offline, Next falls back
   to a full-page navigation, which we serve from the cached HTML. */

const PRECACHE_PREFIX = "superhero-precache-";
const RUNTIME = "superhero-runtime";
const MANIFEST_URL = "/sw-manifest.json";

async function getManifest() {
  const res = await fetch(MANIFEST_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("no manifest");
  return res.json();
}

async function precache() {
  let manifest;
  try {
    manifest = await getManifest();
  } catch {
    return; // dev / first deploy without a manifest — install anyway
  }
  const cache = await caches.open(PRECACHE_PREFIX + manifest.version);
  const assets = manifest.assets || [];
  const BATCH = 40;
  for (let i = 0; i < assets.length; i += BATCH) {
    await Promise.all(
      assets.slice(i, i + BATCH).map((url) => precacheOne(cache, url))
    );
  }
}

// A clean page URL (e.g. "/marvel/spider-man") has no file extension in its last
// segment. It resolves directly on Vercel, but a plain static host needs ".html".
// Fetch with fallbacks, but always store under the clean URL the app navigates to.
function isPageUrl(url) {
  const last = url.split("/").pop() || "";
  return !last.includes(".");
}

async function precacheOne(cache, url) {
  const tries = isPageUrl(url)
    ? [url, (url === "/" ? "/index.html" : url + ".html"), url.replace(/\/$/, "") + "/index.html"]
    : [url];
  for (const candidate of tries) {
    try {
      const r = await fetch(candidate, { cache: "no-store" });
      if (r.ok) {
        await cache.put(url, r);
        return;
      }
    } catch {}
  }
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(precache());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      let version = null;
      try {
        version = (await getManifest()).version;
      } catch {}
      const keep = new Set([RUNTIME]);
      if (version) keep.add(PRECACHE_PREFIX + version);
      const names = await caches.keys();
      await Promise.all(
        names.map((n) => (keep.has(n) ? null : caches.delete(n)))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(handleNavigate(req));
    return;
  }
  event.respondWith(handleAsset(req));
});

// Stale-while-revalidate for navigations, mapped to clean-URL HTML in the precache.
async function handleNavigate(req) {
  const cached = await matchNavigation(req);
  const network = fetch(req)
    .then((res) => {
      if (res && res.ok) {
        caches.open(RUNTIME).then((c) => c.put(req, res.clone()));
      }
      return res;
    })
    .catch(() => null);

  if (cached) return cached;
  const net = await network;
  if (net) return net;

  const index = await caches.match("/", { ignoreSearch: true });
  if (index) return index;
  return new Response(OFFLINE_HTML, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

async function matchNavigation(req) {
  const url = new URL(req.url);
  const path = url.pathname;
  const candidates = [
    req,
    path,
    path.replace(/\/$/, "") || "/",
    path.endsWith("/") ? path + "index.html" : path + ".html",
    (path.replace(/\/$/, "") || "") + "/index.html",
  ];
  for (const c of candidates) {
    const hit = await caches.match(c, { ignoreSearch: true });
    if (hit) return hit;
  }
  return null;
}

// Stale-while-revalidate for static assets (JS, CSS, images, fonts).
async function handleAsset(req) {
  const cached = await caches.match(req);
  const network = fetch(req)
    .then((res) => {
      if (res && res.ok) {
        caches.open(RUNTIME).then((c) => c.put(req, res.clone()));
      }
      return res;
    })
    .catch(() => null);
  if (cached) return cached;
  const net = await network;
  if (net) return net;
  return Response.error();
}

const OFFLINE_HTML = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Offline</title>
<style>body{font-family:system-ui,sans-serif;background:#0a0a0f;color:#fff;
display:flex;min-height:100vh;align-items:center;justify-content:center;
text-align:center;margin:0;padding:24px}h1{font-size:1.4rem}p{opacity:.7}</style>
</head><body><div><h1>You're offline</h1>
<p>Open the app once while connected, then it works in airplane mode.</p></div>
</body></html>`;
