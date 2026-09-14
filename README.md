# 女娲路由 · 独立版（可安装 PWA）

这是从 `nuwa-router.html` 自动生成的**可独立部署**版本。部署到任意静态托管后，
手机可以「添加到主屏幕」当独立 App 用，**不需要电脑开着**。

> ⚠️ 本目录由 `build-pwa.mjs` 生成，请勿直接改这里的 `index.html`。
> 要改内容，改源文件 `../nuwa-router.html`，然后重跑 `node build-pwa.mjs`。

## 目录内容

| 文件 | 作用 |
|---|---|
| `index.html` | 页面本体（源文件 + 独立模式标记 + PWA 挂载点） |
| `manifest.webmanifest` | PWA 清单：名称、图标、独立窗口、主题色 |
| `sw.js` | Service Worker：离线缓存。**跨域请求一律放行**，不缓存模型接口 |
| `icon-512.png` / `icon-192.png` | 主屏图标（金底「女」） |
| `apple-touch-icon.png` | iOS 主屏图标（180×180，必须 PNG） |
| `icon.svg` | 图标源文件 |

## 部署（三选一）

整个目录原样上传即可，不需要构建、不需要后端。

### 1. Cloudflare Pages（推荐，免费且快）
1. 打开 <https://dash.cloudflare.com/> → Workers & Pages → Create → Pages
2. 选 **Upload assets**，把这个目录里的**全部文件**拖进去
3. 得到一个 `xxx.pages.dev` 地址

### 2. Netlify Drop
1. 打开 <https://app.netlify.com/drop>
2. 把目录拖进去，立即得到地址

### 3. GitHub Pages
1. 新建仓库，把目录里的文件推到根目录（或 `docs/`）
2. Settings → Pages → Source 选分支和目录
3. 地址形如 `https://<用户名>.github.io/<仓库>/`

> **国内网络注意**：`*.github.io`、`*.pages.dev`、`*.netlify.app` 在部分网络下
> 访问不稳定。如果打开慢或打不开，改用国内对象存储的静态网站功能
> （腾讯云 COS / 阿里云 OSS），或自备域名 + CDN。

## 装到手机主屏

- **iOS**：必须用 **Safari** 打开（Chrome 不行）→ 分享 → 「添加到主屏幕」
- **Android**：Chrome 打开 → 菜单 → 「安装应用」/「添加到主屏幕」

装完就是一个独立窗口，没有浏览器地址栏；断网也能打开。

## 使用前设置

首次打开会弹设置框，填自己的 **API Key**（DeepSeek 或其他 OpenAI 兼容接口）。

- Key **只存在这台设备的浏览器里**，不会上传到任何地方，也**没有写在这个文件里**
- 换设备要重新填一次

## 和联网版的区别

| | 联网版（DSH 宿主） | 独立版（本目录） |
|---|---|---|
| 需要电脑 | 是 | **否** |
| 历史存储 | 宿主侧 JSON 文件 | 浏览器 localStorage（**仅本机**） |
| 换设备/清缓存 | 不丢 | **会丢** |
| 离线可用 | 否 | 是 |

**历史不跨设备同步。** 手机和电脑各存各的。如果需要同步，得另配一个后端
（例如 Cloudflare KV / Supabase），当前版本没做。

## 更新

改了源文件后：

```sh
node build-pwa.mjs
```

重新上传即可。Service Worker 的缓存名在 `sw.js` 里（`nuwa-v1`），改动较大时
把它改成 `nuwa-v2` 可以强制所有客户端换新缓存。
