import {Competition} from './Competition';


export enum DivisionTypes {
  Amateur, Combine
}

export enum SkillTypes {
  Newcomer, Bronze, Silver, Gold, Syllabus, Novice, PreChamp, Championship, Open,
}

export enum AgeTypes {
  Adult
}

export enum StyleTypes {
  Standard = 1, Smooth = 2, Latin = 4, Rhythm = 8
}

export enum DanceTypes {
  Tango, VWalz, Foxtrot, Walz, QuickStep, Jive, ChaCha, Rumba, Swing
}

export module DanceTypes {
  export const LetterType = {
    T: DanceTypes.Tango,
    V: DanceTypes.VWalz,
    F: DanceTypes.Foxtrot,
    W: DanceTypes.Walz,
    Q: DanceTypes.QuickStep,
    J: DanceTypes.Jive,
    C: DanceTypes.ChaCha,
    R: DanceTypes.Rumba,
    S: DanceTypes.Swing,
  };


  export function getStyleForOne(dance: DanceTypes) {
    if (dance === DanceTypes.Jive || dance === DanceTypes.ChaCha ||
      dance === DanceTypes.Rumba || dance === DanceTypes.Swing) {
      return (StyleTypes.Latin | StyleTypes.Rhythm);
    }
    if (dance === DanceTypes.Foxtrot || dance === DanceTypes.Walz ||
      dance === DanceTypes.QuickStep || dance === DanceTypes.Tango || dance === DanceTypes.VWalz) {
      return (StyleTypes.Smooth | StyleTypes.Standard);
    }
    return null;
  }

  export function getStyle(dances: DanceTypes[]) {
    if (!dances) {
      return null;
    }
    let style: StyleTypes = null;
    for (let i = 0; i < dances.length; i++) {
      if (style == null) {
        style = DanceTypes.getStyleForOne(dances[i]);
      } else if (style !== DanceTypes.getStyleForOne(dances[i])) {
        return null;
      }
    }
    return style;
  }
}


export class Dancer {
  constructor(public name: string) {
  }
}

export class Placement {
  dancers: Dancer[] = [];
  placement: number;
  leaderNumber: number;
  isFinal: boolean;
  event: DanceEvent;


  constructor(placement: number, leaderNumber: number) {
    this.placement = placement;
    this.leaderNumber = leaderNumber;
  }

  addDancer(dancer: Dancer) {
    this.dancers.push(dancer);
  }

  setEvent(event: DanceEvent) {
    if (this.event) {
      throw 'event already set';
    }
    this.event = event;
    this.event.addPlacement(this);
  }

  hasDancer(dancer: Dancer) {
    return this.dancers[0] === dancer || this.dancers[1] === dancer;
  }
}


export class DanceEvent {
  placements: Placement[] = [];
  competition: Competition;

  constructor(public raw: string,
              public division: DivisionTypes,
              public age: AgeTypes,
              public skill: SkillTypes,
              public style: StyleTypes,
              public dances: DanceTypes[]) {

  }


  toString() {
    return {
      raw: this.raw,
      division: DivisionTypes[this.division],
      age: AgeTypes[this.age],
      skill: SkillTypes[this.skill],
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

  hasQuarterFinal(): boolean {
    //TODO: fix it. its just guessing
    return this.placements.length > 30;
  }

  calcPoint(dancer: Dancer, skill: SkillTypes = this.skill) {
    let placement = this.getPlacement(dancer);
    if (!placement.isFinal || skill > this.skill) {
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
    if (skill == this.skill - 1) {
      point *= 2;
    }
    if (skill < this.skill - 1) {
      point = 7;
    }


    return point;
  }
}
