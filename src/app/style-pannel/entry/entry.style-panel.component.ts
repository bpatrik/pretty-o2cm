import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DataService} from '../../services/data.service';
import {DanceTypes, PointSkillTypes, StyleTypes} from '../../../o2cm-parser/entities/Types';
import {Rules} from '../../services/Rules';
import {IEventSummary} from '../../services/ISummary';


@Component({
  selector: 'style-panel-entry',
  templateUrl: './entry.style-panel.component.html',
  styleUrls: ['./entry.style-panel.component.scss'],
})
export class StylePanelEntryComponent {


  @Output() showSubEntries = new EventEmitter();
  @Input() eventSummary: IEventSummary;
  @Input() danceType: DanceTypes;
  @Input() mainEntry: boolean;
  StyleTypes = StyleTypes;
  DanceTypes = DanceTypes;
  PointSkillTypes = PointSkillTypes;
  Rules = Rules;

  constructor(public dataService: DataService) {
  }


  latestEvent(events: IEventSummary[]): IEventSummary {
    events.sort((a, b) => {
      return b.lastCompetition - a.lastCompetition;
    });
    return events[0];
  }

  restEvents(events) {
    events.sort((a, b) => {
      return b.lastCompetition - a.lastCompetition;
    });
    return events.slice(1);
  }

  daysLeft(event: IEventSummary) {
    const length = Rules.Timeout[event.pointSkill];
    const left = (event.startTime + length) - Date.now();
    if (left <= 0) {
      return -1;
    }
    return Math.ceil(left / 1000 / 60 / 60 / 24);
  }

  progress() {
    let timeP = 0;
    let pointP = 0;
    if (Rules.Timeout[this.eventSummary.pointSkill]) {
      const length = Rules.Timeout[this.eventSummary.pointSkill];
      const left = (this.eventSummary.startTime + length) - Date.now();
      timeP = (length - left) / length;
    }
    if (Rules.MaxPoints[this.eventSummary.pointSkill]) {
      pointP = this.eventSummary.points.overall / Rules.MaxPoints[this.eventSummary.pointSkill];
    }
    return Math.round(Math.max(timeP, pointP) * 100);
  }

  color() {
    return PointSkillTypes[this.eventSummary.pointSkill].toLowerCase();
  }


}

