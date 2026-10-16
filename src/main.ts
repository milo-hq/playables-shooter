import Phaser from 'phaser';
import { platform } from './platform';
import { GAME_WIDTH, GAME_HEIGHT } from './game/config';
import { BootScene } from './game/scenes/BootScene';
import { PlayScene } from './game/scenes/PlayScene';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#05070f',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scale: {
    // 设计规则：所有宽高比可玩、不锁方向、不填满时居中。FIT + CENTER_BOTH 正好满足。
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: { keyboard: true, mouse: true, touch: true },
  scene: [BootScene, PlayScene],
});

// 集成 §6：禁止用 Page Visibility API 控制暂停。
// Phaser 内部监听 visibilitychange 并在 tab 隐藏时 loop.pause()，这里把它的处理器摘掉，
// 暂停恢复只听 platform.onPause / onResume。
// onHidden / onVisible 在类型上是 protected，这里只是取引用用于 off()。
const visibility = game as unknown as { onHidden: () => void; onVisible: () => void };
game.events.off(Phaser.Core.Events.HIDDEN, visibility.onHidden, game);
game.events.off(Phaser.Core.Events.VISIBLE, visibility.onVisible, game);

// 集成 §5：初始音频状态跟随 YouTube 设置，之后随其切换同步。
game.sound.mute = !platform.isAudioEnabled();
platform.onAudioEnabledChange((enabled) => { game.sound.mute = !enabled; });

// 集成 §6：onPause 后停掉整个循环和音频；只在 onResume 时恢复。
platform.onPause(() => {
  game.loop.sleep();
  game.sound.pauseAll();
});
platform.onResume(() => {
  game.loop.wake();
  game.sound.resumeAll();
});

console.info(`[platform] ${platform.name}`);
