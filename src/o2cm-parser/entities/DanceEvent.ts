import {Competition, ICompetition} from './Competition';
import {IPlacement, Placement} from './Placement';
import {AgeTypes, DanceTypes, DivisionTypes, EventSkillTypes, PointSkillTypes, StyleTypes} from './Types';
import {DancerName} from '../../app/services/IData';
import {Dancer} from './Dancer';


export interface IDanceEvent {
  placements: IPlacement[];
  pointSkill: PointSkillTypes;
  raw: string;
  division: DivisionTypes;
  age: AgeTypes;
  eventSkill: ISkill;
  style: StyleTypes;
  dances: DanceTypes[];
}

export enum PointWarning {
  QF_W_FEW_COUPLES, NOQF_W_MANY_COUPELS
}

export interface ISkill {
  type: EventSkillTypes;
  str: string;
}


export class DanceEvent implements IDanceEvent {
  placements: Placement[] = [];
  competition: Competition;
  public pointSkill: PointSkillTypes;
  public Rounds = 0;

  constructor(public raw: string,
              public division: DivisionTypes,
              public age: AgeTypes,
              public eventSkill: ISkill,
              public style: StyleTypes,
              public dances: DanceTypes[]) {
    this.pointSkill = EventSkillTypes.toPointSkillType(this.eventSkill.type);
  }


  public static getPlacement(that: IDanceEvent, dancer: DancerName): IPlacement {
    for (let i = 0; i < that.placements.length; i++) {
      if (Placement.hasDancer(that.placements[i], dancer)) {
        return that.placements[i];
      }
    }
    return null;
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

  getPlacement(dancer: DancerName): Placement {
    return <Placement>DanceEvent.getPlacement(this, dancer);
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
    return this.Rounds >= 2 || this.placements.length >= 20;
  }

  private pointWarning(): PointWarning {
    if (this.Rounds >= 2 && this.placements.length <= 15) {
      return PointWarning.QF_W_FEW_COUPLES; // 'Quarter final detected, but too few couples were competing';
    }
    if (this.Rounds < 2 && this.placements.length >= 20 && this.placements.length < 40) {
      return PointWarning.NOQF_W_MANY_COUPELS; // 'No quarter final detected, but more then 20 couples were competing';
    }
    return null;
  }

  calcPoint(dancer: Dancer, skill: PointSkillTypes = this.pointSkill): { value: number, warning: PointWarning } {
    const placement = this.getPlacement(dancer);
    let warning: PointWarning = null;
    let point = 0;
    if (!placement.isFinal || skill > this.pointSkill) {
      return {value: point, warning: warning};
    }
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
        warning = this.pointWarning();
      }
    }
    if (skill === this.pointSkill - 1) {
      point *= 2;
    }
    if (skill < this.pointSkill - 1) {
      point = 7;
    }

    return {value: point, warning: warning};
  }

  toJSONable(): IDanceEvent {
    return {
      age: this.age,
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
