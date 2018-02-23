import {DanceEvent, IDanceEvent} from './DanceEvent';
import {CompetitionCore, IComparableCompetition} from '../IndividualParser';


export interface ICompetition extends IComparableCompetition {
  name: string;
  date: number;
  linkCode: string;
  dancedEvents: IDanceEvent[];
}

export class Competition implements ICompetition {
  name: string;
  date: number;
  linkCode: string;
  dancedEvents: DanceEvent[];


  constructor(core: CompetitionCore) {
    this.name = core.name;
    this.date = core.date;
    this.linkCode = core.linkCode;
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
      name: this.name,
      date: this.date,
      linkCode: this.linkCode,
      dancedEvents: this.dancedEvents.map(e => e.toJSONable())
    };
  }
}
