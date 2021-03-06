import {Competition, ICompetition} from './Competition';
import {IPlacement, Placement} from './Placement';
import {AgeTypes, DanceTypes, DivisionTypes, EventSkillTypes, PointSkillTypes, StyleTypes} from './Types';
import {Dancer} from './Dancer';
import {DancerName} from '../../../frontend/app/services/IData';


export interface IDanceEvent {
  placements: IPlacement[];
  pointSkill: PointSkillTypes;
  raw: string;
  division: DivisionTypes;
  age: AgeTypes;
  eventSkill: ISkill;
  style: StyleTypes;
  dances: DanceTypes[];
  heatid: string;
  rounds: number;
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
  public rounds = 0;

  constructor(public raw: string,
              public heatid: string,
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


  static hasQuarterFinal(that: IDanceEvent): boolean {
    return that.rounds >= 2 || that.placements.length >= 20;
  }

  private static pointWarning(that: IDanceEvent): PointWarning {
    if (that.rounds >= 2 && that.placements.length <= 15) {
      return PointWarning.QF_W_FEW_COUPLES; // 'Quarter final detected, but too few couples were competing';
    }
    if (that.rounds < 2 && that.placements.length >= 20 && that.placements.length < 40) {
      return PointWarning.NOQF_W_MANY_COUPELS; // 'No quarter final detected, but more then 20 couples were competing';
    }
    return null;
  }

  public static hasDancer(that: IDanceEvent, dancer: DancerName): boolean {
    for (let i = 0; i < that.placements.length; i++) {
      if (Placement.hasDancer(that.placements[i], dancer)) {
        return true;
      }
    }
    return false;
  }

  static calcPointForPlacement(that: IDanceEvent,
                               placement: IPlacement,
                               skill: PointSkillTypes = that.pointSkill): { value: number, warning: PointWarning } {
    let warning: PointWarning = null;
    let point = 0;
    if (!placement.isFinal || skill > that.pointSkill) {
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
    if (DanceEvent.hasQuarterFinal(that)) {
      if (placement.placement >= 4 && placement.placement <= 6) {
        point = 1;
        warning = DanceEvent.pointWarning(that);
      }
    }
    if (skill === that.pointSkill - 1) {
      point *= 2;
    }
    if (skill < that.pointSkill - 1) {
      point = 7;
    }

    return {value: point, warning: warning};
  }


  static calcPoint(that: IDanceEvent,
                   dancer: DancerName,
                   skill: PointSkillTypes = that.pointSkill): { value: number, warning: PointWarning } {
    const placement = DanceEvent.getPlacement(that, dancer);
    return DanceEvent.calcPointForPlacement(that, placement, skill);
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
    return DanceEvent.hasDancer(this, dancer);
  }

  addPlacement(placement: Placement) {
    this.placements.push(placement);
  }

  public calcPoint(dancer: DancerName, skill?: PointSkillTypes) {
    return DanceEvent.calcPoint(this, dancer, skill);
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
        if (this.placements[i].leader.equals(dancer)) {
          return this.placements[i].follower || new Dancer('TBA');
        } else {
          return this.placements[i].leader || new Dancer('TBA');
        }
      }
    }
  }


  toJSONable(): IDanceEvent {
    return {
      age: this.age,
      heatid: this.heatid,
      dances: this.dances,
      division: this.division,
      eventSkill: this.eventSkill,
      placements: this.placements.map(p => p.toJSONable()),
      pointSkill: this.pointSkill,
      raw: this.raw,
      style: this.style,
      rounds: this.rounds
    };
  }


}
