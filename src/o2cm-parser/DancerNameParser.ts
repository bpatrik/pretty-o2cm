import {Placement} from './entities/Placement';
import {DancerRepository} from './DancerRepository';

export class PlacementParser {
  static parse(rawName: string): Placement {
    if (rawName.charAt(rawName.length - 4) === '-') {
      rawName = rawName.substring(0, rawName.length - 4);
    }

    let placement: number = null;
    let number: number = null;
    let names: string[] = [];
    if (rawName.indexOf(')') !== -1) {
      placement = parseInt(rawName.substring(0, rawName.indexOf(')')), 10);
      rawName = rawName.substring(rawName.indexOf(')') + 1);
    }

    let clone = rawName.trim();
    if (clone.indexOf(' ')) {
      clone = clone.substring(0, clone.indexOf(' '));
      if (!isNaN(<any>clone[0]) && !isNaN(<any>clone[clone.length - 1])) {
        number = parseInt(clone, 10);
        rawName = rawName.substring(rawName.trim().indexOf(' ') + 1);
      }
    }
    names = rawName.split('&');


    const plcmnt = new Placement(placement, number);
    for (let i = 0; i < names.length; i++) {
      plcmnt.addDancer(DancerRepository.Instance.createOrGet(names[i].trim()));
    }

    return plcmnt;
  }
}
