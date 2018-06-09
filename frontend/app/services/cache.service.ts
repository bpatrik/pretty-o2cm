import {Injectable} from '@angular/core';
import {DancerName, IData} from './IData';
import {DataParserService} from './data-loader.service';

@Injectable()
export class CacheService {
  static KEY_PREFIX = 'dancer:';
  static KEY_VERSION = 'version';
  static KEY_LIST = 'list';
  cacheList: string[];
  ready = true;


  constructor() {
    const version = localStorage.getItem(CacheService.KEY_VERSION);
    this.cacheList = JSON.parse(localStorage.getItem(CacheService.KEY_LIST));
    if (version !== DataParserService.VERSION || !this.cacheList) {
      this.reset();
    }
  }

  private reset() {
    try {
      localStorage.clear();
      this.cacheList = [];
      localStorage.setItem(CacheService.KEY_VERSION, DataParserService.VERSION);
      localStorage.setItem(CacheService.KEY_LIST, JSON.stringify(this.cacheList));
    } catch (err) {
      this.ready = false;
    }
  }

  public get(dancerName: DancerName): IData {
    if (this.ready === false) {
      return null;
    }
    try {
      const key = CacheService.KEY_PREFIX + dancerName.firstName.toLowerCase() + '' + dancerName.lastName.toLowerCase();
      return JSON.parse(localStorage.getItem(key));
    } catch (err) {

    }
    return null;
  }

  public put(data: IData) {
    if (this.ready === false) {
      return;
    }
    try {
      const key = CacheService.KEY_PREFIX + data.dancerName.firstName.toLowerCase() + '' + data.dancerName.lastName.toLowerCase();
      if (this.cacheList.indexOf(key) !== -1) {
        this.cacheList.splice(this.cacheList.indexOf(key), 1);
      }
      this.cacheList.push(key);
      if (this.cacheList.length >= 10) {
        localStorage.removeItem(this.cacheList.shift());
      }
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(CacheService.KEY_LIST, JSON.stringify(this.cacheList));
    } catch (err) {
      this.reset();
    }
  }

}
