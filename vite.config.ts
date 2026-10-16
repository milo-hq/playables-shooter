import { defineConfig } from 'vite';

export default defineConfig({
  // Playables 规则：bundle 内只能用相对路径，绝对路径会加载失败。
  base: './',
  build: {
    target: 'es2022',
    // 文件名只允许字母数字和 _ - . ，Vite 默认的 hash 命名符合要求。
    rollupOptions: {
      output: {
        // 把 Phaser 单独拆出来，游戏代码改动时引擎 chunk 可以缓存。
        manualChunks: { phaser: ['phaser'] },
      },
    },
  },
  server: { port: 5173 },
});
