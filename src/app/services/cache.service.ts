import {Injectable} from '@angular/core';
import {DancerName, IData} from './IData';

@Injectable()
export class CacheService {
  static KEY_PREFIX = 'dancer:';

  public get(dancerName: DancerName): IData {
    const key = CacheService.KEY_PREFIX + dancerName.firstName.toLowerCase() + '' + dancerName.lastName.toLowerCase();
    return JSON.parse(localStorage.getItem(key));
  }

  public put(data: IData) {
    const key = CacheService.KEY_PREFIX + data.dancerName.firstName.toLowerCase() + '' + data.dancerName.lastName.toLowerCase();
    localStorage.setItem(key, JSON.stringify(data));
  }

}
