# Playables Shooter

竖版射击游戏（HTML5），目标渠道 YouTube Playables，同时兼容 Poki / CrazyGames / Telegram 等门户。

## 技术栈

Phaser 3 + TypeScript + Vite。纯 JS，不用 WASM、Web Worker、eval。

## 四条架构约束（第一天就定下，后补等于重写）

1. **不接任何外部服务器。** Playables 的 CSP `connect-src` 只允许 `'self' blob: data:`，排行榜、存档、广告全走平台 SDK。
2. **平台适配层。** 游戏逻辑只调 `src/platform/types.ts` 的 `Platform` 接口，底下 `playables.ts`（ytgame SDK）和 `local.ts`（localStorage 回退）各一个实现。接新门户只加一个文件。
3. **全宽高比自适应，不锁横竖屏。** 逻辑分辨率 540×960，Phaser `Scale.FIT + CENTER_BOTH` 自动 pillarbox / letterbox。
4. **纯 JS。** 引擎选 Phaser 3，不用 Unity WebGL。

## 开发

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # 产出 dist/，相对路径，可直接打包
pnpm bundle     # 产出 bundle.zip，提交 Playables 用
```

## 本地验证 Playables CSP

Playables 运行时会加一条严格的 Content-Security-Policy。本地用 Chrome DevTools 的 Local Overrides 给 `index.html` 响应头加上下面这条，确认没有被拦截的请求：

```
default-src 'none'; script-src 'report-sample' 'self' 'unsafe-eval' 'unsafe-inline' blob: https://www.youtube.com/game_api/v0 https://www.youtube.com/game_api/v0/ https://www.youtube.com/game_api/v1 https://www.youtube.com/game_api/v1/; object-src 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data:; media-src 'self' blob:; font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com; connect-src 'self' blob: data:; sandbox allow-pointer-lock allow-same-origin allow-scripts; base-uri 'self'; manifest-src 'self'; worker-src 'self' blob:
```

来源：[Test suite guide](https://developers.google.com/youtube/gaming/playables/reference/test_suite_guide)。

## Playables 认证清单对照

| 规则 | 位置 |
|---|---|
| SDK 在游戏代码前加载 | `index.html` |
| `firstFrameReady` 在 loading 画面调用 | `BootScene.ts` |
| `gameReady` 在可交互后调用 | `PlayScene.ts` |
| 存档只用 `saveData` / `loadData` | `platform/playables.ts` |
| 音频跟随 YouTube 静音 | `main.ts` |
| `onPause` / `onResume` 控制循环，不用 Page Visibility API | `main.ts`（摘掉 Phaser 的 HIDDEN/VISIBLE 处理器） |
| 所有宽高比、不锁方向、居中 | `main.ts` scale 配置 |
| 触屏 + 鼠标 + 键盘 | `PlayScene.ts` |
| 相对路径、文件名字符集 | `vite.config.ts` |
| 无退出 / 分享 / 外链 / 总静音按钮 | 设计约定 |

包体限制：首包 MUST < 30 MiB（建议 15），总包 < 250 MiB，单文件 MUST < 30 MiB（建议 512 KiB），文件数 ≤ 8000，JS 堆峰值 < 512 MB。Phaser 本体约 1.2 MB，超出单文件建议值但在 MUST 之内。

官方文档：
- [认证要求](https://developers.google.com/youtube/gaming/playables/certification/requirements)
- [SDK 参考](https://developers.google.com/youtube/gaming/playables/reference/sdk)
- [Developer Portal](https://developers.google.com/youtube/gaming/playables/developer_portal)

## 现状

- [x] 骨架：平台层、自适应布局、拖拽 / 键盘移动、自动开火、滚动星空
- [ ] 敌机、碰撞、血量、无尽难度曲线
- [ ] 计分、最高分存档、`sendScore`
- [ ] 死亡后看广告续命（`requestRewardedAd('continue')`）
- [ ] Poki / CrazyGames 平台实现
- [ ] 美术替换占位几何图形
