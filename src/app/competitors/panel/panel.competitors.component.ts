import {Component, Input} from '@angular/core';
import {DanceEvent} from '../../../o2cm-parser/entities/DanceEvent';
import {DancerName} from '../../services/IData';
import {DataService} from '../../services/data.service';
import {Dancer} from '../../../o2cm-parser/entities/Dancer';
import {IDatedDanceEvent} from './IDatedDanceEvent';


@Component({
  selector: 'app-competitors-panel-component',
  templateUrl: './panel.competitors.component.html',
  styleUrls: ['./panel.competitors.component.scss'],
})
export class CompetitorsPanelComponent {
  static tenPercentDivider = (1000 * 60 * 60 * 24 * 182) / 0.7;
  static COLOR_STRONGER = [255, 193, 7];
  static COLOR_EQUAL = [0, 123, 255];
  static COLOR_WEAKER = [40, 167, 69];
  @Input() panelName: string;

  expand = false;
  rankings: { dancer: DancerName, score: number, accuracy: number }[] = [];
  myRank = 0;
  min = {
    score: 0,
    accuracy: 0
  };
  max = {
    score: 0,
    accuracy: 0,
    scoreDiff: 0
  };

  @Input() set danceEvents(dances: IDatedDanceEvent[]) {
    const list: { [key: string]: { points: number, accuracy: number } } = {};
    const me = this.dataService.data.getValue().dancerName;


    for (let i = 0; i < dances.length; i++) {
      const myPlacement = DanceEvent.getPlacement(dances[i], me);

      for (let j = 0; j < dances[i].placements.length; j++) {
        const plm = dances[i].placements[j];
        const point = (myPlacement.placement - dances[i].placements[j].placement) / dances[i].placements.length;
        const base = 1 - ((Date.now() - dances[i].date) / CompetitorsPanelComponent.tenPercentDivider);
        const accuracy = base * base;
        for (let k = 0; k < dances[i].placements[j].dancers.length; k++) {
          const key = (plm.dancers[k].firstName + ' ' + plm.dancers[k].lastName).trim();
          if (key === '') {
            continue;
          }
          list[key] = list[key] || {points: 0, accuracy: 0};
          list[key].points += point * accuracy;
          list[key].accuracy += accuracy;
        }
      }
    }

    const rankings = Object.keys(list);

    this.rankings = rankings.map((key) => {
      return {dancer: Dancer.getName(key), score: list[key].points, accuracy: list[key].accuracy};
    }).sort((a, b) => {
      return b.accuracy - a.accuracy;
    }).slice(0, Math.min(Math.max(rankings.length * 0.4, 50), 200));

    this.min.accuracy = this.rankings[this.rankings.length - 1].accuracy;
    this.max.accuracy = this.rankings[0].accuracy;

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

  }

  constructor(public dataService: DataService) {
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
    const max = Math.min(Math.abs(this.max.score), Math.abs(this.min.score));
    const endColor = score > 0 ? CompetitorsPanelComponent.COLOR_STRONGER : CompetitorsPanelComponent.COLOR_WEAKER;
    const multiple = Math.min(Math.abs(score / max), 1);
    for (let i = 0; i < 3; i++) {
      color[i] = Math.floor((endColor[i] - CompetitorsPanelComponent.COLOR_EQUAL[i]) * multiple
        + CompetitorsPanelComponent.COLOR_EQUAL[i]);
    }
    return this.rgbToHex(color[0], color[1], color[2]);
  }

  size(accuracy: number) {
    const multiple = (accuracy - this.min.accuracy) / (this.max.accuracy - this.min.accuracy);
    return (0.4 * multiple + 0.6);
  }

}

