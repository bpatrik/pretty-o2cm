import {Component, Input} from '@angular/core';
import {DataService} from '../services/data.service';
import {DanceTypes, PointSkillTypes, StyleTypes} from '../../o2cm-parser/entities/Types';
import {Rules} from '../services/Rules';
import {IDanceSummary, IEventSummary, IStyleSummary} from '../services/ISummary';


@Component({
  selector: 'style-panel',
  templateUrl: './style-panel.component.html',
  styleUrls: ['./style-panel.component.scss'],
})
export class StylePanelComponent {


  @Input() styleSummary: IStyleSummary;
  StyleTypes = StyleTypes;
  DanceTypes = DanceTypes;
  PointSkillTypes = PointSkillTypes;
  Rules = Rules;

  constructor() {
  }


  latestEvent(events: IEventSummary[]): IEventSummary {
    events.sort((a, b) => {
      return b.lastCompetition - a.lastCompetition;
    });
    return events[0];
  }

  restEvents(events: IEventSummary[]) {
    return events.filter(e => e.lastCompetition !== null).sort((a, b) => {
      return b.lastCompetition - a.lastCompetition;
    }).slice(1);
  }


  color(dance: IDanceSummary) {
    return PointSkillTypes[this.latestEvent(dance.entries).pointSkill].toLowerCase();
  }


}

