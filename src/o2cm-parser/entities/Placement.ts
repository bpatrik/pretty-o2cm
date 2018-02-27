import {DanceEvent} from './DanceEvent';
import {DancerName} from '../../app/services/IData';
import {Dancer} from './Dancer';

export interface IPlacement {
  dancers: Dancer[];
  placement: number;
  leaderNumber: number;
  isFinal: boolean;
  event: DanceEvent;
}

export class Placement implements IPlacement {
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
    if (this.dancers.length > 2) {
      throw  new Error('too many dancers');
    }
  }

  setEvent(event: DanceEvent) {
    if (this.event) {
      throw new Error('event already set');
    }
    this.event = event;
    this.event.addPlacement(this);
  }

  hasDancer(dancer: DancerName) {
    return (this.dancers[0] && this.dancers[0].equals(dancer)) || (this.dancers[1] && this.dancers[1].equals(dancer));
  }


  toJSONable(): IPlacement {
    return {
      dancers: this.dancers,
      placement: this.placement,
      leaderNumber: this.leaderNumber,
      isFinal: this.isFinal,
      event: null
    };
  }
}
