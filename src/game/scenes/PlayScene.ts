import Phaser from 'phaser';
import { platform } from '../../platform';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

const SHIP_SPEED = 520;      // 键盘移动速度 px/s
const FIRE_INTERVAL = 140;   // ms
const BULLET_SPEED = 900;

/**
 * 最小可玩骨架：拖拽 / 方向键移动飞机，自动开火，滚动星空。
 * 敌机、碰撞、计分、存档、续命广告都留给后续迭代。
 */
export class PlayScene extends Phaser.Scene {
  private ship!: Phaser.GameObjects.Triangle;
  private bullets!: Phaser.GameObjects.Group;
  private stars!: Phaser.GameObjects.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private dragTarget: Phaser.Math.Vector2 | null = null;
  private lastFire = 0;

  constructor() { super('Play'); }

  create() {
    this.createStars();
    this.createShip();
    this.bullets = this.add.group();
    this.setupInput();

    this.add.text(GAME_WIDTH / 2, 40, 'DRAG / ARROWS TO MOVE', {
      fontFamily: 'monospace', fontSize: '20px', color: '#678',
    }).setOrigin(0.5);

    // 集成 §2：此刻用户可以操作了，通知 YouTube 收起 spinner。
    platform.gameReady();
  }

  private createStars() {
    this.stars = this.add.group();
    for (let i = 0; i < 80; i++) {
      const s = this.add.rectangle(
        Phaser.Math.Between(0, GAME_WIDTH), Phaser.Math.Between(0, GAME_HEIGHT),
        2, 2, 0xffffff, Phaser.Math.FloatBetween(0.2, 0.9),
      );
      s.setData('speed', Phaser.Math.Between(60, 220));
      this.stars.add(s);
    }
  }

  private createShip() {
    this.ship = this.add.triangle(GAME_WIDTH / 2, GAME_HEIGHT - 140, 0, 40, 20, 0, 40, 40, 0x4fd1ff);
    this.ship.setOrigin(0.5, 0.5);
  }

  private setupInput() {
    // 设计规则：触屏和鼠标 MUST 都能完成所有操作。Phaser pointer 同时覆盖两者。
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => { this.dragTarget = new Phaser.Math.Vector2(p.worldX, p.worldY); });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => { if (p.isDown) this.dragTarget = new Phaser.Math.Vector2(p.worldX, p.worldY); });
    this.input.on('pointerup', () => { this.dragTarget = null; });

    // 设计规则：键盘是 SHOULD。createCursorKeys 只捕获方向键，不会 preventDefault Esc。
    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  update(time: number, delta: number) {
    const dt = delta / 1000;

    // 星空滚动
    this.stars.getChildren().forEach((obj) => {
      const s = obj as Phaser.GameObjects.Rectangle;
      s.y += (s.getData('speed') as number) * dt;
      if (s.y > GAME_HEIGHT) { s.y = 0; s.x = Phaser.Math.Between(0, GAME_WIDTH); }
    });

    // 移动：拖拽目标优先，否则键盘
    if (this.dragTarget) {
      this.ship.x = Phaser.Math.Linear(this.ship.x, this.dragTarget.x, Math.min(1, dt * 18));
      this.ship.y = Phaser.Math.Linear(this.ship.y, this.dragTarget.y, Math.min(1, dt * 18));
    } else {
      const dx = (this.cursors.left.isDown ? -1 : 0) + (this.cursors.right.isDown ? 1 : 0);
      const dy = (this.cursors.up.isDown ? -1 : 0) + (this.cursors.down.isDown ? 1 : 0);
      this.ship.x += dx * SHIP_SPEED * dt;
      this.ship.y += dy * SHIP_SPEED * dt;
    }
    this.ship.x = Phaser.Math.Clamp(this.ship.x, 20, GAME_WIDTH - 20);
    this.ship.y = Phaser.Math.Clamp(this.ship.y, 20, GAME_HEIGHT - 20);

    // 自动开火
    if (time - this.lastFire > FIRE_INTERVAL) {
      this.lastFire = time;
      const b = this.add.rectangle(this.ship.x, this.ship.y - 24, 4, 14, 0xfff27a);
      this.bullets.add(b);
    }
    this.bullets.getChildren().forEach((obj) => {
      const b = obj as Phaser.GameObjects.Rectangle;
      b.y -= BULLET_SPEED * dt;
      if (b.y < -20) b.destroy();
    });
  }
}
