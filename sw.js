/* 女娲路由 · Service Worker
 *
 * 目标：手机装到主屏后，断网也能打开；有网时自动拿最新版。
 *
 * 一条硬规则：**绝不拦截跨域请求**。模型接口（api.deepseek.com）必须实时联网，
 * 让它命中缓存会返回过期或错误的结果。所以下面一切逻辑都先判 origin。
 */
const CACHE = 'nuwa-v1'
const SHELL = [
  './', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE)
    // 逐个 add：任何一个 404 都不该让整个安装失败
    await Promise.all(SHELL.map((u) => cache.add(u).catch(() => {})))
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  let url
  try { url = new URL(req.url) } catch { return }

  // 跨域一律放行给网络，不进缓存
  if (url.origin !== self.location.origin) return

  // 页面导航：网络优先（能拿到更新），失败回落缓存（离线可用）
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req)
        const cache = await caches.open(CACHE)
        cache.put('./index.html', fresh.clone())
        return fresh
      } catch {
        return (await caches.match('./index.html')) || Response.error()
      }
    })())
    return
  }

  // 静态资源：缓存优先
  event.respondWith((async () => {
    const hit = await caches.match(req)
    if (hit) return hit
    const res = await fetch(req)
    if (res.ok) {
      const cache = await caches.open(CACHE)
      cache.put(req, res.clone())
    }
    return res
  })())
})
