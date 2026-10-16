import type { Platform } from './types';

/** 直接转发到 ytgame SDK。只在 ytgame.IN_PLAYABLES_ENV 为真时使用。 */
export class PlayablesPlatform implements Platform {
  readonly name = 'playables';

  firstFrameReady() { ytgame.game.firstFrameReady(); }
  gameReady() { ytgame.game.gameReady(); }

  loadData() { return ytgame.game.loadData(); }
  saveData(data: string) { return ytgame.game.saveData(data); }

  sendScore(score: number) {
    // SDK 要求整数且不超过 MAX_SAFE_INTEGER。
    return ytgame.engagement.sendScore({ value: Math.floor(score) });
  }

  requestRewardedAd(rewardId: string) { return ytgame.ads.requestRewardedAd(rewardId); }
  requestInterstitialAd() { return ytgame.ads.requestInterstitialAd(); }

  isAudioEnabled() { return ytgame.system.isAudioEnabled(); }
  onAudioEnabledChange(cb: (enabled: boolean) => void) { return ytgame.system.onAudioEnabledChange(cb); }

  onPause(cb: () => void) { return ytgame.system.onPause(cb); }
  onResume(cb: () => void) { return ytgame.system.onResume(cb); }

  getLanguage() { return ytgame.system.getLanguage(); }
}
