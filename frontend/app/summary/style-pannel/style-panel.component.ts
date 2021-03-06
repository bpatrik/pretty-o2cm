import {Component, Input} from '@angular/core';
import {DanceTypes, PointSkillTypes, StyleTypes} from '../../../../common/o2cm-parser/entities/Types';
import {Rules} from '../../services/Rules';
import {IDanceSummary, IEventSummary, IStyleSummary} from '../../services/ISummary';


@Component({
  selector: 'app-style-panel-component',
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

  restEvents(events: IEventSummary[]): IEventSummary[] {
    return events.filter(e => e.lastCompetition !== null).sort((a, b) => {
      return b.lastCompetition - a.lastCompetition;
    }).slice(1);
  }


  color(dance: IDanceSummary) {
    return PointSkillTypes[this.latestEvent(dance.entries).pointSkill].toLowerCase();
  }


}

