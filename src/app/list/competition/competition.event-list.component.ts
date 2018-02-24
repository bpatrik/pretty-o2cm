import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ICompetitionList} from '../../services/IData';
import {Rules} from '../../services/Rules';
import {EventSkillTypes} from '../../../o2cm-parser/entities/Types';


@Component({
  selector: 'app-competition-event-list',
  templateUrl: './competition.event-list.component.html',
  styleUrls: ['./competition.event-list.component.scss'],
})
export class CompetitionEventListComponent {

  @Output() pointPresentation = new EventEmitter();
  @Input() showPercentage: boolean;
  @Input() competition: ICompetitionList;

  noPointReason() {
    for (let i = 0; i < Rules.NoPointExceptions.length; i++) {
      if (this.competition.competition.name.toLowerCase().indexOf(Rules.NoPointExceptions[i].name.toLowerCase()) !== -1) {
        return Rules.NoPointExceptions[i].reason;
      }
    }
    return null;
  }

  getNewPoints(): { color: string, points: number }[] {
    if (this.noPointReason() !== null) {
      return [];
    }
    const tmp = {};
    for (let i = 0; i < this.competition.dances.length; i++) {
      const key = EventSkillTypes[this.competition.dances[i].eventSkill].toLowerCase();
      tmp[key] = tmp[key] || 0;
      tmp[key] += this.competition.dances[i].point;
    }
    const ret: { color: string, points: number }[] = [];
    for (const key in tmp) {
      if (!tmp.isPrototypeOf(key) || tmp[key] === 0) {
        continue;
      }
      ret.push({color: key, points: tmp[key]});
    }
    return ret;
  }
}

