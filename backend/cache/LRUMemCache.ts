import {ICache} from './ICache';

export class LRUMemCache<T> implements ICache<T> {
  list: { key: string, value: T }[] = [];
  hash: { [key: string]: T } = {};

  constructor(private size: number) {

  }

  get(key: string): Promise<T> {
    if (this.hash[key]) {
      const index = this.list.findIndex(i => i.key === key);
      const item = this.list.splice(index, 1)[0];
      this.list.unshift(item);
    }
    return Promise.resolve(this.hash[key]);
  }

  set(key: string, value: T): Promise<void> {
    if (this.list.length >= this.size) {
      delete this.hash[this.list.pop().key];
    }
    const item = {key: key, value: value};
    this.list.unshift(item);
    this.hash[key] = value;
    return Promise.resolve();
  }
}
