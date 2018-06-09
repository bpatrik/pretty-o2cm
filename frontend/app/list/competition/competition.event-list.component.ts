import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DancerName, ICompetitionList} from '../../services/IData';
import {Rules} from '../../services/Rules';
import {EventSkillTypes, PointSkillTypes} from '../../../../common/o2cm-parser/entities/Types';
import {DataService} from '../../services/data.service';
import {ICompetition} from '../../../../common/o2cm-parser/entities/Competition';
import {DanceEvent} from '../../../../common/o2cm-parser/entities/DanceEvent';


@Component({
  selector: 'app-competition-event-list',
  templateUrl: './competition.event-list.component.html',
  styleUrls: ['./competition.event-list.component.scss'],
})
export class CompetitionEventListComponent {

  @Output() pointPresentation = new EventEmitter();
  @Input() showPercentage: boolean;
  @Input() competition: ICompetition;
  @Input() dancer: DancerName;
  @Input() compactLayout = false;
  PointSkillTypes = PointSkillTypes;


  constructor(public dataService: DataService) {
  }

  noPointReason() {
    for (let i = 0; i < Rules.NoPointExceptions.length; i++) {
      if (this.competition.rawName.toLowerCase().indexOf(Rules.NoPointExceptions[i].name.toLowerCase()) !== -1) {
        return Rules.NoPointExceptions[i].reason;
      }
    }
    return null;
  }

  getNewPoints(): { color: string, points: number, skill: PointSkillTypes }[] {
    if (this.noPointReason() !== null) {
      return [];
    }
    const tmp = {};
    for (let i = 0; i < this.competition.dancedEvents.length; i++) {
      const key = this.competition.dancedEvents[i].pointSkill;
      tmp[key] = tmp[key] || 0;
      tmp[key] += DanceEvent.calcPoint(this.competition.dancedEvents[i], this.dancer).value;
    }
    const ret: { color: string, points: number, skill: PointSkillTypes }[] = [];
    for (const key in tmp) {
      if (!tmp.hasOwnProperty(key) || tmp[key] === 0) {
        continue;
      }
      ret.push({color: PointSkillTypes[parseInt(key, 10)].toLowerCase(), points: tmp[key], skill: parseInt(key, 10)});
    }
    return ret;
  }
}

