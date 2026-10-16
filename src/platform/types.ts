/**
 * 游戏逻辑只依赖这个接口，不直接碰任何平台 SDK。
 * 每个方法旁边标注了它对应的 YouTube Playables 认证规则，
 * 以后接 Poki / CrazyGames 只需再写一个实现。
 */
export interface Platform {
  readonly name: string;

  /** 集成 §2：loading 画面开始渲染时调用，必须早于 gameReady。 */
  firstFrameReady(): void;
  /** 集成 §2：用户可以交互时调用，不能在 loading 画面期间调用。 */
  gameReady(): void;

  /** 集成 §4：存档只能走这里，不能用 localStorage 等其他机制。上限 3 MiB。 */
  loadData(): Promise<string>;
  /** 集成 §4：必须先 await loadData 再调 saveData。 */
  saveData(data: string): Promise<void>;

  /** 集成 §3：上报最高分，必须与存档里的最高分一致。 */
  sendScore(score: number): Promise<void>;

  /** 变现：激励广告，resolve true 表示用户看完应发奖励。 */
  requestRewardedAd(rewardId: string): Promise<boolean>;
  /** 变现：插屏广告，不保证展示，不能用来发奖励。 */
  requestInterstitialAd(): Promise<void>;

  /** 集成 §5：初始音频状态必须跟随 YouTube 设置。 */
  isAudioEnabled(): boolean;
  /** 集成 §5：YouTube 静音切换时游戏必须同步。返回取消订阅函数。 */
  onAudioEnabledChange(cb: (enabled: boolean) => void): () => void;

  /** 集成 §6：onPause 后必须停掉游戏循环、音频、渲染、网络。不能用 Page Visibility API。 */
  onPause(cb: () => void): () => void;
  /** 集成 §6：只有 onResume 才能恢复，且不保证一定会 resume。 */
  onResume(cb: () => void): () => void;

  /** 国际化：BCP-47，不要存进存档，随时会变。 */
  getLanguage(): Promise<string>;
}
