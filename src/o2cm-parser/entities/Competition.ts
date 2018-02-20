import {DanceEvent} from "./DanceEvent";
import {CompetitionCore} from "../IndividualParser";

export class Competition {
  name: string;
  date: Date;
  linkCode: string;
  dancedEvents: DanceEvent[];


  constructor(core: CompetitionCore) {
    this.name = core.name;
    this.date = core.date;
    this.linkCode = core.linkCode;
  }

  set DanceEvents(dancedEvents: DanceEvent[]) {
    if (this.dancedEvents) {
      throw "Dance events already set";
    }
    this.dancedEvents = dancedEvents;
    this.dancedEvents.forEach((d) => {
      d.Competition = this;
    });
  }


}
