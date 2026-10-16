import type { Platform } from './types';
import { PlayablesPlatform } from './playables';
import { LocalPlatform } from './local';

export type { Platform } from './types';

/** 官方推荐的检测方式：ytgame 存在且 IN_PLAYABLES_ENV 为真。 */
export function detectPlatform(): Platform {
  if (typeof ytgame !== 'undefined' && ytgame.IN_PLAYABLES_ENV) {
    return new PlayablesPlatform();
  }
  return new LocalPlatform();
}

export const platform: Platform = detectPlatform();
