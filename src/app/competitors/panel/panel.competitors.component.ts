import {Component, Input, OnChanges} from '@angular/core';
import {DanceEvent} from '../../../o2cm-parser/entities/DanceEvent';
import {DancerName} from '../../services/IData';
import {DataService} from '../../services/data.service';
import {Dancer} from '../../../o2cm-parser/entities/Dancer';
import {IDatedDanceEvent} from './IDatedDanceEvent';
import {RoleType} from '../RoleType';


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

  RoleType = RoleType;
  expand = false;
  rankings: { dancer: DancerName, score: number, accuracy: number, role: RoleType, gotBetter: boolean }[] = [];
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
    if (this.expand) {
      this.renderSections.first.start = Math.floor(Math.max(0, this.myRank - this.maxRender.expanded / 2));
      this.renderSections.first.end = Math.floor(Math.min(this.rankings.length - 1,
        Math.max(this.myRank + this.maxRender.expanded / 2, this.renderSections.first.start + this.maxRender.expanded )));
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
        accuracy: number, role: RoleType, fromLastComp: number, previousScore: number
      }
    } = {};
    const me = this.dataService.data.getValue().dancerName;

    this.danceEvents.sort((a, b) => a.date - b.date);
    const lastCompDate = this.danceEvents[this.danceEvents.length - 1].date;
    for (let i = 0; i < this.danceEvents.length; i++) {
      const myPlacement = DanceEvent.getPlacement(this.danceEvents[i], me);

      for (let j = 0; j < this.danceEvents[i].placements.length; j++) {
        const plm = this.danceEvents[i].placements[j];
        const point = (myPlacement.placement - this.danceEvents[i].placements[j].placement) / this.danceEvents[i].placements.length;
        const base = 1 - ((Date.now() - this.danceEvents[i].date) / CompetitorsPanelComponent.tenPercentDivider);
        const accuracy = base * base;

        const addPoint = (dancer: DancerName, role: RoleType) => {
          const key = (dancer.firstName + ' ' + dancer.lastName).trim();
          list[key] = list[key] || {
            points: 0, accuracy: 0,
            role: role, fromLastComp: 0, previousScore: 0
          };
          list[key].points += point * accuracy;
          list[key].accuracy += accuracy;
          if (plm === myPlacement) {
            list[key].accuracy += 999;
          }
          if (this.danceEvents[i].date === lastCompDate) {
            list[key].fromLastComp += point * accuracy;
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
        gotBetter: list[key].fromLastComp < 0 && list[key].previousScore > 0
      };
    }).sort((a, b) => {
      return b.accuracy - a.accuracy;
    }).slice(0, Math.min(Math.max(rankings.length * 0.5, 150), 500))
      .filter((r) => r.role === this.roleFilter ||
        r.role === RoleType.Mixed ||
        this.roleFilter === RoleType.Mixed ||
        Dancer.equals(r.dancer, me));


    this.rankings = this.rankings.sort((a, b) => {
      if (b.score === a.score) {
        if (a.dancer.lastName < b.dancer.lastName) {
          return -1;
        }
        if (a.dancer.lastName > b.dancer.lastName) {
          return 1;
        }
        return a.dancer.firstName < b.dancer.firstName ? -1 : 1;
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

  toggleExpand(event) {
    this.expand = !this.expand;
    this.updateRenderBoundaries();
    event.stopPropagation();
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

}

