import {Component} from '@angular/core';
import {DataService} from '../services/data.service';
import {ActivatedRoute} from '@angular/router';
import {Params} from '@angular/router/src/shared';
import {DanceEvent, IDanceEvent, PointWarning} from '../../o2cm-parser/entities/DanceEvent';
import {ICompetition} from '../../o2cm-parser/entities/Competition';
import {Dancer} from '../../o2cm-parser/entities/Dancer';
import {PointSkillTypes} from '../../o2cm-parser/entities/Types';
import {Rules} from '../services/Rules';
import {QueryParams} from '../QueryParams';
import {DancerName} from '../services/IData';


@Component({
  selector: 'app-event-component',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent {

  competition: ICompetition;
  dance: IDanceEvent;
  myPlacementIndex: number;
  points: { value: number, warning: PointWarning }[];
  eventFilter = {
    compCode: '',
    heatid: '',
  };

  constructor(public dataService: DataService,
              private route: ActivatedRoute) {
    route.queryParams.subscribe((value: Params) => {
      this.eventFilter.compCode = value[QueryParams.compCode];
      this.eventFilter.heatid = value[QueryParams.heatid];
      this.getDanceEvent();
    });
    this.dataService.data.subscribe(() => {
      this.getDanceEvent();
    });

  }

  getDanceEvent() {
    this.competition = null;
    for (let i = 0; i < this.dataService.data.getValue().competitions.length; i++) {
      if (this.dataService.data.getValue().competitions[i].linkCode === this.eventFilter.compCode) {
        this.competition = this.dataService.data.getValue().competitions[i];
        break;
      }
    }
    if (this.competition === null) {
      return;
    }
    this.dance = null;
    for (let i = 0; i < this.competition.dancedEvents.length; i++) {
      if (this.competition.dancedEvents[i].heatid === this.eventFilter.heatid) {
        this.dance = this.competition.dancedEvents[i];
        break;
      }
    }

    this.dance.placements.sort((a, b) => {
      if (a.placement === b.placement) {
        return Dancer.compare(a.leader, b.leader);

      }
      return a.placement - b.placement;
    });
    const me = this.dataService.data.getValue().dancerName;
    this.myPlacementIndex = this.dance.placements.findIndex((plm) => Dancer.equals(plm.leader, me) || Dancer.equals(plm.follower, me));
    this.points = [];
    for (let i = 0; i < this.dance.placements.length; i++) {
      this.points.push(DanceEvent.calcPoint(this.dance, this.dance.placements[i].leader));
    }

  }

  color() {
    return PointSkillTypes[this.dance.pointSkill].toLowerCase();
  }

  noPointReason() {
    for (let i = 0; i < Rules.NoPointExceptions.length; i++) {
      if (this.competition.rawName.toLowerCase().indexOf(Rules.NoPointExceptions[i].name.toLowerCase()) !== -1) {
        return Rules.NoPointExceptions[i].reason;
      }
    }
    return null;
  }


  url(dancer: DancerName) {
    return window.location.origin +
      window.location.pathname +
      '?firstName=' +
      dancer.firstName +
      '&lastName=' +
      dancer.lastName;
  }


}

