import {ICache} from './ICache';

export class DummyCache<T> implements ICache<T> {

  get(key: string): Promise<T> {
    return Promise.resolve(undefined);
  }

  set(key: string, value: T): Promise<void> {
    return Promise.resolve();
  }
}
