// 最小化的 YouTube Playables SDK 类型声明。
// 来源：https://developers.google.com/youtube/gaming/playables/reference/sdk
declare namespace ytgame {
  const IN_PLAYABLES_ENV: boolean;
  const SDK_VERSION: string;

  namespace ads {
    function requestInterstitialAd(): Promise<void>;
    function requestRewardedAd(rewardId: string): Promise<boolean>;
  }

  namespace engagement {
    function sendScore(score: { value: number }): Promise<void>;
  }

  namespace game {
    function firstFrameReady(): void;
    function gameReady(): void;
    function loadData(): Promise<string>;
    function saveData(data: string): Promise<void>;
  }

  namespace health {
    function logError(): void;
    function logWarning(): void;
  }

  namespace system {
    function getLanguage(): Promise<string>;
    function isAudioEnabled(): boolean;
    function onAudioEnabledChange(cb: (enabled: boolean) => void): () => void;
    function onPause(cb: () => void): () => void;
    function onResume(cb: () => void): () => void;
  }
}
