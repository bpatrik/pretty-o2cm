import {AgeTypes, DanceTypes, DivisionTypes, EventSkillTypes, StyleTypes} from './entities/Types';
import {Utils} from '../Utils';
import {DanceEvent, ISkill} from './entities/DanceEvent';

export class EventNameParser {


  private static parseAge(name: string): AgeTypes {
    const ages = Utils.enumToArray(AgeTypes);
    for (let i = 0; i < ages.length; i++) {
      if (name.indexOf(ages[i].value) !== -1) {
        return ages[i].key;
      }
    }
    return null;
  }

  private static parseSkill(name: string): ISkill {
    const list = Utils.enumToArray(EventSkillTypes);
    list.push({key: EventSkillTypes.PreChamp, value: 'Pre-Champ'});
    list.push({key: EventSkillTypes.Champ, value: 'Championship'});
    list.sort(); // order to long to short

    for (let i = 0; i < list.length; i++) {
      if (name.indexOf(' ' + list[i].value) !== -1) {
        const startIndex = name.indexOf(list[i].value);
        const rawStr = name.substring(name.lastIndexOf(' ', startIndex) + 1, name.indexOf(' ', startIndex));
        return {type: list[i].key, str: rawStr};
      }
    }
    console.warn('can\'t parse skill: ' + name);
    return null;
  }

  private static parseDivision(name: string): DivisionTypes {
    const list = Utils.enumToArray(DivisionTypes);

    for (let i = 0; i < list.length; i++) {
      if (name.indexOf(list[i].value) !== -1) {
        return list[i].key;
      }
    }
    return null;
  }

  private static parseStyle(name: string, dances: DanceTypes[]): StyleTypes {
    const list = Utils.enumToArray(StyleTypes);

    for (let i = 0; i < list.length; i++) {
      if (name.indexOf(list[i].value) !== -1) {
        return list[i].key;
      }
    }
    if (name.indexOf('Am.') !== -1) {
      // noinspection TsLint
      if ((DanceTypes.getStyle(dances) & StyleTypes.Rhythm) !== 0) {
        return StyleTypes.Rhythm;
      }
      // noinspection TsLint
      if ((DanceTypes.getStyle(dances) & StyleTypes.Smooth) !== 0) {
        return StyleTypes.Smooth;
      }
    }

    // if not Am., then international by default

    // noinspection TsLint
    if ((DanceTypes.getStyle(dances) & StyleTypes.Latin) !== 0) {
      return StyleTypes.Latin;
    }
    // noinspection TsLint
    if ((DanceTypes.getStyle(dances) & StyleTypes.Standard) !== 0) {
      return StyleTypes.Standard;
    }

    return null;
  }

  private static adjustDances(dances: DanceTypes[], style: StyleTypes): DanceTypes[] {
    if (!dances) {
      return dances;
    }
    // TODO: make it more  abstract
    for (let i = 0; i < dances.length; i++) {
      if (dances[i] === DanceTypes.Swing && style === StyleTypes.Latin) {
        dances[i] = DanceTypes.Samba;
      }
    }

    return dances;
  }

  private static guessDances(name: string): DanceTypes[] {
    if (name.lastIndexOf('(') !== -1 && name.lastIndexOf(')') !== -1) {
      const list = [];
      const letters = name.substring(name.lastIndexOf('(') + 1, name.lastIndexOf(')'));
      for (let i = 0; i < letters.length; i++) {
        list.push(DanceTypes.LetterType[letters.charAt(i)]);
      }
      return list;
    }

    return null;
  }

  public static parse(name: string): DanceEvent {
    const division = this.parseDivision(name) || DivisionTypes.Amateur;
    const age = this.parseAge(name);
    const skill = this.parseSkill(name);
    let dances = this.guessDances(name);
    const style = this.parseStyle(name, dances);
    dances = this.adjustDances(dances, style);
    return new DanceEvent(name, division, age, skill, style, dances);
  }
}
