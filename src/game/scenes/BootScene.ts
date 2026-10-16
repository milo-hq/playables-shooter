import Phaser from 'phaser';
import { platform } from '../../platform';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

/** 显示 loading 文案并调用 firstFrameReady，然后进入 PlayScene。 */
export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'LOADING...', {
      fontFamily: 'monospace', fontSize: '32px', color: '#9ad',
    }).setOrigin(0.5);

    // 集成 §2：loading 画面已经在渲染，通知 YouTube 第一帧就绪。
    platform.firstFrameReady();

    // 现在还没有真正的资源要加载，等一帧让 loading 文案画出来再切场景。
    this.time.delayedCall(50, () => this.scene.start('Play'));
  }
}
