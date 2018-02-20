import {AgeTypes, DanceEvent, DanceTypes, DivisionTypes, SkillTypes, StyleTypes} from './entities/DanceEvent';
import {Utils} from '../Utils';

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

  private static parseSkill(name: string): SkillTypes {
    const list = Utils.enumToArray(SkillTypes);
    list.push({key: SkillTypes.Bronze, value: 'Beginner'});
    list.push({key: SkillTypes.Silver, value: 'Intermediate'});
    list.push({key: SkillTypes.Gold, value: 'Advanced'});
    list.push({key: SkillTypes.PreChamp, value: 'Pre-Champ'});
    list.push({key: SkillTypes.Championship, value: 'Champ'});

    for (let i = 0; i < list.length; i++) {
      if (name.indexOf(list[i].value) !== -1) {
        return list[i].key;
      }
    }
    console.warn('cant parse skill: ' + name);
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
      if ((DanceTypes.getStyle(dances) & StyleTypes.Rhythm) !== 0) {
        return StyleTypes.Rhythm;
      }
      if ((DanceTypes.getStyle(dances) & StyleTypes.Smooth) !== 0) {
        return StyleTypes.Smooth;
      }
    }
    if (name.indexOf('Intl.') !== -1) {
      if ((DanceTypes.getStyle(dances) & StyleTypes.Latin) !== 0) {
        return StyleTypes.Latin;
      }
      if ((DanceTypes.getStyle(dances) & StyleTypes.Standard) !== 0) {
        return StyleTypes.Standard;
      }
    }

    return null;
  }

  private static parseDances(name: string): DanceTypes[] {
    if (name.indexOf('(') !== -1 && name.indexOf(')') !== -1) {
      const list = [];
      const letters = name.substring(name.indexOf('(') + 1, name.indexOf(')'));
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
    const dances = this.parseDances(name);
    const style = this.parseStyle(name, dances);
    return new DanceEvent(name, division, age, skill, style, dances);
  }
}
