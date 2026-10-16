import type { Platform } from './types';

const SAVE_KEY = 'playables-shooter.save';

/**
 * 本地开发 / 其他门户的回退实现：
 * 存档走 localStorage，广告直接视为看完，暂停恢复从不触发。
 * 注意：Playables 环境下绝不能走到这里，saveData 必须是 SDK 的。
 */
export class LocalPlatform implements Platform {
  readonly name = 'local';

  firstFrameReady() { console.info('[platform:local] firstFrameReady'); }
  gameReady() { console.info('[platform:local] gameReady'); }

  async loadData() {
    try { return localStorage.getItem(SAVE_KEY) ?? ''; } catch { return ''; }
  }
  async saveData(data: string) {
    try { localStorage.setItem(SAVE_KEY, data); } catch { /* 隐私模式等情况忽略 */ }
  }

  async sendScore(score: number) { console.info('[platform:local] sendScore', score); }

  async requestRewardedAd(rewardId: string) {
    console.info('[platform:local] rewardedAd', rewardId);
    return true;
  }
  async requestInterstitialAd() { console.info('[platform:local] interstitialAd'); }

  isAudioEnabled() { return true; }
  onAudioEnabledChange() { return () => {}; }

  onPause() { return () => {}; }
  onResume() { return () => {}; }

  async getLanguage() { return navigator.language || 'en'; }
}
