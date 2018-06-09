import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Params} from '@angular/router/src/shared';
import {IDanceEvent} from '../../../common/o2cm-parser/entities/DanceEvent';
import {Dancer} from '../../../common/o2cm-parser/entities/Dancer';
import {Rules} from '../services/Rules';
import {QueryParams} from '../QueryParams';
import {DancerName, IData} from '../services/IData';
import {RegistrationService} from '../services/registration.service';
import {ISummary} from '../services/ISummary';
import {IPlacement, Placement} from '../../../common/o2cm-parser/entities/Placement';


@Component({
  selector: 'app-registration-component',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {

  events: IDanceEvent[];
  eventid = '';

  constructor(public regService: RegistrationService,
              private route: ActivatedRoute) {
    route.queryParams.subscribe((value: Params) => {
      this.eventid = value[QueryParams.eventid];
      this.getRegistration();
    });

  }

  async getRegistration() {
    this.events = (await this.regService.getDances(this.eventid));
    this.events.forEach(e => e.placements.forEach(p => {
      if (p.follower && !Dancer.isTBA(p.follower)) {
        this.regService.loadSummary(p.follower);
      }
      if (p.leader && !Dancer.isTBA(p.leader)) {
        this.regService.loadSummary(p.leader);
      }
    }));
  }

  url(dancer: DancerName): string {
    if (!dancer) {
      return '#';
    }
    return window.location.origin +
      window.location.pathname +
      '?firstName=' +
      dancer.firstName +
      '&lastName=' +
      dancer.lastName;
  }


  key(dancer: DancerName): string {
    return Dancer.toKey(dancer);
  }

  pointsPlacedOut(dancer: DancerName, event: IDanceEvent) {
    return Rules.MaxPoints[event.pointSkill] && this.points(dancer, event) >= Rules.MaxPoints[event.pointSkill];
  }

  points(dancer: DancerName, event: IDanceEvent) {
    const summary: ISummary = this.regService.summaries.getValue()[this.key(dancer)];
    const ps = ISummary.findPointSummary(summary, event);
    if (ps.length === 0) {
      return 0;
    }
    return ps.map(v => v.points.overall).reverse()[0];
  }

  timeout(dancer: DancerName, dance: IDanceEvent) {
    const left = this.left(dancer, dance);
    if (left && left < 0) {
      return true;
    }
  }

  hasTimeout(dance: IDanceEvent) {
    return !!Rules.Timeout[dance.pointSkill];
  }

  left(dancer: DancerName, dance: IDanceEvent) {
    if (!Rules.Timeout[dance.pointSkill]) {
      return null;
    }
    const summary: ISummary = this.regService.summaries.getValue()[this.key(dancer)];
    const ps = ISummary.findPointSummary(summary, dance);
    if (ps.length === 0) {
      return null;
    }
    const startTime = ps.map(v => v.startTime).sort()[0];
    if (startTime === 0 || startTime === null) {
      return null;
    }
    const length = Rules.Timeout[dance.pointSkill];
    const left = ((startTime + length) - Date.now());
    return Math.ceil(left / 1000 / 60 / 60 / 24);
  }

  studio(plm: IPlacement) {
    if (plm.leader) {
      return plm.leader.studio;
    }
    if (plm.follower) {
      return plm.follower.studio;
    }
    return 'N/A';
  }

  hasError(plm: IPlacement, dance: IDanceEvent) {
    if ((!plm.follower || Dancer.isTBA(plm.follower)) ||
      (!plm.leader || Dancer.isTBA(plm.leader))) {
      return false;
    }

    if (plm.follower && !Dancer.isTBA(plm.follower) && (!this.regService.summaries.getValue()[this.key(plm.follower)] ||
      (this.timeout(plm.follower, dance) || this.pointsPlacedOut(plm.follower, dance)))) {
      return true;
    }
    if (plm.leader && !Dancer.isTBA(plm.leader) && (!this.regService.summaries.getValue()[this.key(plm.leader)] ||
      (this.timeout(plm.leader, dance) || this.pointsPlacedOut(plm.leader, dance)))) {
      return true;
    }
    return false;
  }

}

