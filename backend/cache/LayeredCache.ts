import {ICache} from './ICache';

/**
 * The order of the caches are important.
 * Will ook first in the first cache, then the second one, etc..
 */
export class LayeredCache implements ICache<string> {
  constructor(private caches: ICache<string>[]) {

  }

  async get(key: string): Promise<string> {
    for (let i = 0; i < this.caches.length; ++i) {
      const ret = await this.caches[i].get(key);
      if (ret) {
        for (let j = i; j > 0; j--) {
          await this.caches[j].set(key, ret);
        }
        return ret;
      }
    }
    return undefined;
  }

  async set(key: string, value: string): Promise<void> {
    for (let i = 0; i < this.caches.length; ++i) {
      await this.caches[i].set(key, value);
    }
  }
}
