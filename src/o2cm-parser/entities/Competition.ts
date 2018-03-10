import {DanceEvent, IDanceEvent} from './DanceEvent';
import {CompetitionCore, IComparableCompetition} from '../IndividualParser';


export interface ICompetition extends IComparableCompetition {
  rawName: string;
  name: string;
  date: number;
  linkCode: string;
  dancedEvents: IDanceEvent[];
}

export class Competition implements ICompetition {
  rawName: string;
  name: string;
  date: number;
  linkCode: string;
  dancedEvents: DanceEvent[];


  constructor(core: CompetitionCore) {
    this.rawName = core.rawName;
    this.name = core.name;
    this.date = core.date;
    this.linkCode = core.linkCode;
  }

  public static shallowCopy(that: ICompetition): ICompetition {
    return {
      rawName: that.rawName,
      name: that.name,
      date: that.date,
      linkCode: that.linkCode,
      dancedEvents: that.dancedEvents
    };
  }

  get DanceEvents(): DanceEvent[] {
    return this.dancedEvents;
  }

  set DanceEvents(dancedEvents: DanceEvent[]) {
    if (this.dancedEvents) {
      throw new Error('Dance events already set');
    }
    this.dancedEvents = dancedEvents;
    this.dancedEvents.forEach((d) => {
      d.Competition = this;
    });
  }

  toJSONable(): ICompetition {
    return {
      rawName: this.rawName,
      name: this.name,
      date: this.date,
      linkCode: this.linkCode,
      dancedEvents: this.dancedEvents.map(e => e.toJSONable())
    };
  }
}
