import {DanceEvent} from './DanceEvent';
import {DancerName} from '../../app/services/IData';
import {Dancer} from './Dancer';

export interface IPlacement {
  leader: DancerName;
  follower: DancerName;
  placement: number;
  leaderNumber: number;
  isFinal: boolean;
}

export class Placement implements IPlacement {
  leader: Dancer;
  follower: Dancer;
  placement: number;
  leaderNumber: number;
  isFinal: boolean;
  event: DanceEvent;


  constructor(placement: number, leaderNumber: number) {
    this.placement = placement;
    this.leaderNumber = leaderNumber;
  }

  public static hasDancer(that: IPlacement, other: DancerName): boolean {
    return (that.leader && Dancer.equals(that.leader, other)) ||
      (that.follower && Dancer.equals(that.follower, other));
  }

  public static getPartner(that: IPlacement, dancer: DancerName): DancerName {
    if (Dancer.equals(that.leader, dancer)) {
      return that.follower || Dancer.getName('Unknown Partner');
    } else {
      return that.leader || Dancer.getName('Unknown Partner');
    }
  }

  set Leader(dancer: Dancer) {
    this.leader = dancer;
  }

  set Follower(dancer: Dancer) {
    this.follower = dancer;
  }

  setEvent(event: DanceEvent) {
    if (this.event) {
      throw new Error('event already set');
    }
    this.event = event;
    this.event.addPlacement(this);
  }

  hasDancer(dancer: DancerName): boolean {
    return Placement.hasDancer(this, dancer);
  }


  toJSONable(): IPlacement {
    return {
      leader: this.leader ? this.leader.toJSONable() : null,
      follower: this.follower ? this.follower.toJSONable() : null,
      placement: this.placement,
      leaderNumber: this.leaderNumber,
      isFinal: this.isFinal
    };
  }
}
