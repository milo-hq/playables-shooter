/**
 * 逻辑分辨率固定为 9:16 竖屏战场。
 * 设计规则：MUST 支持所有宽高比且不锁定方向。
 * Phaser Scale.FIT 会等比缩放并居中，横屏时自然 pillarbox，竖屏窄屏时 letterbox。
 */
export const GAME_WIDTH = 540;
export const GAME_HEIGHT = 960;
