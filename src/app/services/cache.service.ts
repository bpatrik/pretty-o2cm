import {Injectable} from '@angular/core';
import {DancerName, IData} from './IData';

@Injectable()
export class CacheService {
  static KEY_PREFIX = 'dancer:';

  public get(dancerName: DancerName): IData {
    const key = CacheService.KEY_PREFIX + dancerName.firstName + '' + dancerName.lastName;
    return JSON.parse(localStorage.getItem(key));
  }

  public put(data: IData) {
    const key = CacheService.KEY_PREFIX + data.dancerName.firstName + '' + data.dancerName.lastName;
    localStorage.setItem(key, JSON.stringify(data));
  }

}
