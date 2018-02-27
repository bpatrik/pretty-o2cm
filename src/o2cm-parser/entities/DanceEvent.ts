import {Competition} from './Competition';
import {IPlacement, Placement} from './Placement';
import {AgeTypes, DanceTypes, DivisionTypes, EventSkillTypes, PointSkillTypes, StyleTypes} from './Types';
import {DancerName} from '../../app/services/IData';
import {nmcall} from 'q';


export interface IDanceEvent {
  placements: IPlacement[];
  competition: Competition;
  pointSkill: PointSkillTypes;
  raw: string;
  division: DivisionTypes;
  age: AgeTypes;
  eventSkill: ISkill;
  style: StyleTypes;
  dances: DanceTypes[];
}

export class Dancer implements DancerName {
  public firstName: string;
  public lastName: string;


  constructor(public name: string) {
    const n = Dancer.getName(name);
    this.firstName = n.firstName;
    this.lastName = n.lastName;
  }

  public static getName(name: string): DancerName {
    name = name.trim();

    const space = name.indexOf(' ');
    let firstName = name;
    let lastName = '';
    if (space !== -1) {
      firstName = name.substring(0, space).trim();
      lastName = name.substring(space).trim();
    }
    return {
      firstName: firstName,
      lastName: lastName
    };
  }

  equals(other: DancerName) {
    return this.firstName.toLowerCase() === other.firstName.toLowerCase() && this.lastName.toLowerCase() === other.lastName.toLowerCase();
  }


}

export interface ISkill {
  type: EventSkillTypes;
  str: string;
}


export class DanceEvent implements IDanceEvent {
  placements: Placement[] = [];
  competition: Competition;
  public pointSkill: PointSkillTypes;

  constructor(public raw: string,
              public division: DivisionTypes,
              public age: AgeTypes,
              public eventSkill: ISkill,
              public style: StyleTypes,
              public dances: DanceTypes[]) {
    this.pointSkill = EventSkillTypes.toPointSkillType(this.eventSkill.type);
  }


  toString() {
    return {
      raw: this.raw,
      division: DivisionTypes[this.division],
      age: AgeTypes[this.age],
      skill: EventSkillTypes[this.eventSkill.type],
      style: StyleTypes[this.style],
      dances: this.dances.map(v => DanceTypes[v])
    };
  }

  hasDancer(dancer: Dancer): boolean {
    for (let i = 0; i < this.placements.length; i++) {
      if (this.placements[i].hasDancer(dancer)) {
        return true;
      }
    }
    return false;
  }

  addPlacement(placement: Placement) {
    this.placements.push(placement);
  }

  public set Competition(comp: Competition) {
    this.competition = comp;
  }

  public get Competition(): Competition {
    return this.competition;
  }

  get CoupleCount() {
    return this.placements.length;
  }

  getPlacement(dancer: Dancer): Placement {
    for (let i = 0; i < this.placements.length; i++) {
      if (this.placements[i].hasDancer(dancer)) {
        return this.placements[i];
      }
    }
  }

  getPartner(dancer: Dancer): Dancer {
    for (let i = 0; i < this.placements.length; i++) {
      if (this.placements[i].hasDancer(dancer)) {
        if (this.placements[i].dancers[0] === dancer) {
          return this.placements[i].dancers[1] || new Dancer('TBA');
        } else {
          return this.placements[i].dancers[0] || new Dancer('TBA');
        }
      }
    }
  }

  hasQuarterFinal(): boolean {
    // TODO: fix it. its just guessing
    return this.placements.length > 30;
  }

  calcPoint(dancer: Dancer, skill: PointSkillTypes = this.pointSkill) {
    const placement = this.getPlacement(dancer);
    if (!placement.isFinal || skill > this.pointSkill) {
      return 0;
    }
    let point = 0;
    if (placement.placement === 1) {
      point = 3;
    }
    if (placement.placement === 2) {
      point = 2;
    }
    if (placement.placement === 3) {
      point = 1;
    }
    if (this.hasQuarterFinal()) {
      if (placement.placement >= 4 && placement.placement <= 6) {
        point = 1;
      }
    }
    if (skill === this.pointSkill - 1) {
      point *= 2;
    }
    if (skill < this.pointSkill - 1) {
      point = 7;
    }


    return point;
  }

  toJSONable(): IDanceEvent {
    return {
      age: this.age,
      competition: null,
      dances: this.dances,
      division: this.division,
      eventSkill: this.eventSkill,
      placements: this.placements.map(p => p.toJSONable()),
      pointSkill: this.pointSkill,
      raw: this.raw,
      style: this.style
    };
  }
}
