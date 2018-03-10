import {Component, Input, OnChanges} from '@angular/core';
import {DanceEvent} from '../../../o2cm-parser/entities/DanceEvent';
import {DancerName} from '../../services/IData';
import {DataService} from '../../services/data.service';
import {Dancer} from '../../../o2cm-parser/entities/Dancer';
import {IDatedDanceEvent} from './IDatedDanceEvent';
import {RoleType} from '../RoleType';
import {DanceTypes} from '../../../o2cm-parser/entities/Types';


export interface IRankDetails {

  score: { score: number, from: string }[];
  accuracy: { accuracy: number, from: string }[];
}

export interface IRank {
  dancer: DancerName;
  score: number;
  accuracy: number;
  role: RoleType;
  gotBetter: boolean;
  details?: IRankDetails;
}

@Component({
  selector: 'app-competitors-panel-component',
  templateUrl: './panel.competitors.component.html',
  styleUrls: ['./panel.competitors.component.scss'],
})
export class CompetitorsPanelComponent implements OnChanges {
  static tenPercentDivider = (1000 * 60 * 60 * 24 * 182) / 0.7;
  static COLOR_STRONGER = [255, 193, 7];
  static COLOR_EQUAL = [0, 123, 255];
  static COLOR_WEAKER = [40, 167, 69];
  @Input() panelName: string;
  @Input() roleFilter: RoleType;
  @Input() danceEvents: IDatedDanceEvent[];
  @Input() short = false;
  @Input() comparingDate: number;

  RoleType = RoleType;
  expand = false;
  rankings: IRank[] = [];
  myRank = 0;
  min = {
    score: 0,
  };
  max = {
    score: 0,
    scoreDiff: 0
  };

  maxRender = {
    compact: 8,
    expanded: 30
  };
  gotBetterCount = 0;
  renderSections = {
    openTop: false,
    expandedOpenTop: false,
    first: {
      start: 0,
      end: 0
    }
  };


  constructor(public dataService: DataService) {
    this.updateRenderBoundaries();
  }


  ngOnChanges(): void {
    if (this.short) {
      this.maxRender.compact = 4;
    } else {
      this.maxRender.compact = 8;
    }
    if (this.danceEvents && typeof this.roleFilter !== 'undefined') {
      this.roleFilter = parseInt(this.roleFilter + '', 10);
      this.calcRanks();
    }
    this.updateRenderBoundaries();

  }

  private updateRenderBoundaries() {
    this.renderSections.expandedOpenTop = Math.floor(Math.max(0, this.myRank - this.maxRender.expanded / 2)) > 0;
    if (this.expand) {
      this.renderSections.first.start = Math.floor(Math.max(0, this.myRank - this.maxRender.expanded / 2));
      this.renderSections.first.end = Math.floor(Math.min(this.rankings.length - 1,
        Math.max(this.myRank + this.maxRender.expanded / 2, this.renderSections.first.start + this.maxRender.expanded)));
      if (window['debug'] === true) {
        this.renderSections.first.start = 0;
        this.renderSections.first.end = this.rankings.length - 1;
      }
    } else {
      this.renderSections.first.start = Math.max(0, this.myRank - this.maxRender.compact / 2);
      this.renderSections.first.end = Math.min(this.rankings.length - 1, this.myRank + this.maxRender.compact / 2);
    }
    this.renderSections.openTop = this.renderSections.first.start > 0;

  }

  private calcRanks() {
    const list: {
      [key: string]: {
        points: number,
        accuracy: number,
        role: RoleType,
        fromLastComp: number,
        previousScore: number,
        details?: IRankDetails
      }
    } = {};
    const me = this.dataService.data.getValue().dancerName;
    this.danceEvents.sort((a, b) => a.date - b.date);
    const lastCompDate = this.danceEvents[this.danceEvents.length - 1].date;

    const round = (a) => {
      return Math.round(a * 100000) / 100000;
    };
    for (let i = 0; i < this.danceEvents.length; i++) {
      const myPlacement = DanceEvent.getPlacement(this.danceEvents[i], me);

      for (let j = 0; j < this.danceEvents[i].placements.length; j++) {
        const plm = this.danceEvents[i].placements[j];
        const point = round((myPlacement.placement - this.danceEvents[i].placements[j].placement) / this.danceEvents[i].placements.length);

        const H = (1000 * 60 * 60 * 24 * 182);
        const accuracy = Math.pow(10, -(this.comparingDate - this.danceEvents[i].date) / H);

        if (accuracy > 1 || accuracy < 0) {
          console.error('accuracy error');
          console.log(accuracy, lastCompDate, this.danceEvents[i].date, CompetitorsPanelComponent.tenPercentDivider, plm);
        }
        const correctedPoints = point * accuracy;

        const addPoint = (dancer: DancerName, role: RoleType) => {
          const key = (dancer.firstName + ' ' + dancer.lastName).trim();
          list[key] = list[key] || {
            points: 0, accuracy: 0,
            role: role, fromLastComp: 0, previousScore: 0
          };
          list[key].points += correctedPoints;
          list[key].accuracy += accuracy;

          if (window['debug'] === true) {
            list[key].details = list[key].details || {accuracy: [], score: []};
            list[key].details.accuracy.push({
              accuracy: accuracy,
              from: new Date(this.danceEvents[i].date).toDateString() + ', ' + DanceTypes[this.danceEvents[i].dances[0]]
            });
            list[key].details.score.push({
              score: correctedPoints,
              from: new Date(this.danceEvents[i].date).toDateString() + ', ' + DanceTypes[this.danceEvents[i].dances[0]]
            });
          }
          if (plm === myPlacement && Dancer.equals(dancer, me)) {
            list[key].accuracy += 999;
          }
          if (this.danceEvents[i].date === lastCompDate) {
            list[key].fromLastComp += correctedPoints;
          } else {
            list[key].previousScore = list[key].points;
          }
          list[key].role = list[key].role === role ? role : RoleType.Mixed;
        };
        if (plm.follower && !Dancer.isTBA(plm.follower)) {
          addPoint(plm.follower, RoleType.Follow);
        }
        if (plm.leader && !Dancer.isTBA(plm.leader)) {
          addPoint(plm.leader, RoleType.Lead);
        }
      }
    }

    const rankings = Object.keys(list);

    this.rankings = rankings.map((key) => {
      return {
        dancer: Dancer.getName(key),
        score: list[key].points,
        accuracy: list[key].accuracy,
        role: list[key].role,
        gotBetter: list[key].fromLastComp < 0 && list[key].previousScore > 0,
        details: list[key].details
      };
    }).sort((a, b) => {
      if (b.accuracy === a.accuracy) {
        return Dancer.compare(a.dancer, b.dancer);
      }
      return b.accuracy - a.accuracy;
    });

    let endIndex = this.rankings.findIndex(r => (r.accuracy < this.rankings[1].accuracy * 0.3)); // first one is 'me'
    endIndex = Math.min(endIndex, rankings.length * 0.5, 300);
    endIndex = Math.max(endIndex, this.maxRender.expanded);

//    console.log(this.panelName, avgAcc, this.rankings[1].accuracy);

    if (this.rankings[Math.floor(this.rankings.length / 3)].accuracy === this.rankings[this.rankings.length - 1].accuracy) {
      endIndex = this.rankings.length - 1;
    }

    this.rankings = this.rankings.slice(0, endIndex)
      .filter((r) => r.role === this.roleFilter ||
        r.role === RoleType.Mixed ||
        this.roleFilter === RoleType.Mixed ||
        Dancer.equals(r.dancer, me));


    this.rankings = this.rankings.sort((a, b) => {
      if (b.score === a.score) {
        return Dancer.compare(a.dancer, b.dancer);
      }
      return b.score - a.score;
    });

    this.min.score = this.rankings[this.rankings.length - 1].score;
    this.max.score = this.rankings[0].score;

    this.max.scoreDiff = Math.max(Math.abs(this.max.score), Math.abs(this.min.score));


    for (let i = 0; i < this.rankings.length; i++) {
      if (Dancer.equals(this.rankings[i].dancer, me)) {
        this.myRank = i;
        break;
      }
    }


    this.gotBetterCount = this.rankings.filter(r => r.gotBetter === true).length;

  }

  url(dancer: DancerName) {
    return window.location.origin +
      window.location.pathname +
      '?firstName=' +
      dancer.firstName +
      '&lastName=' +
      dancer.lastName;
  }

  toggleExpand() {
    this.expand = !this.expand;
    this.updateRenderBoundaries();
  }

  componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

  rgbToHex(r, g, b) {
    return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }

  color(score: number) {
    const color = [0, 0, 0];
    let max = Math.min(Math.abs(this.max.score), Math.abs(this.min.score));
    if (max === 0) {
      max += Number.EPSILON;
    }
    const endColor = score > 0 ? CompetitorsPanelComponent.COLOR_STRONGER : CompetitorsPanelComponent.COLOR_WEAKER;
    const multiple = Math.min(Math.abs(score / max), 1);
    for (let i = 0; i < 3; i++) {
      color[i] = Math.floor((endColor[i] - CompetitorsPanelComponent.COLOR_EQUAL[i]) * multiple
        + CompetitorsPanelComponent.COLOR_EQUAL[i]);
    }
    return this.rgbToHex(color[0], color[1], color[2]);
  }


  isBetter(score: number) {
    return score > this.max.scoreDiff * 0.08;
  }

  isTheSame(score: number) {
    return score < this.max.scoreDiff * 0.08 && score > -this.max.scoreDiff * 0.08;
  }

  isWorst(score: number) {
    return score < -this.max.scoreDiff * 0.08;
  }

  placementDescription(): string {
    const divisions = [0.05, 0.1, 0.15, 0.2, 0.25];
    for (let i = 0; i < divisions.length; i++) {
      if (this.myRank < this.rankings.length * divisions[i]) {
        return '- top ' + divisions[i] * 100 + '%';
      }
    }
    return '';
  }

  showRanking(): boolean {
    return this.renderSections.expandedOpenTop === false ||
      this.myRank <= this.rankings.length - this.maxRender.expanded / 6;
  }

  roleImg(role: RoleType): string {
    switch (role) {
      case RoleType.Mixed:
        return 'couple.svg';
      case RoleType.Lead:
        return 'leader.svg';
      case RoleType.Follow:
        return 'follower.svg';
    }
  }

}

