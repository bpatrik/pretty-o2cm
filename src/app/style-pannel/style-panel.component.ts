import {Component, Input} from "@angular/core";
import {DataService} from "../services/data.service";
import {DanceTypes, SkillTypes, StyleTypes} from "../../o2cm-parser/entities/DanceEvent";
import {Rules} from "../services/Rules";
import {IDanceSummary, IEventSummary, IStyleSummary} from "../services/ISummary";


@Component({
  selector: 'style-panel',
  templateUrl: './style-panel.component.html',
  styleUrls: ['./style-panel.component.scss'],
})
export class StylePanelComponent {


  @Input() styleSummary: IStyleSummary;
  StyleTypes = StyleTypes;
  DanceTypes = DanceTypes;
  SkillTypes = SkillTypes;
  Rules = Rules;

  constructor() {
  }


  latestEvent(events: IEventSummary[]): IEventSummary {
    events.sort((a, b) => {
      return b.lastCompetition.getTime() - a.lastCompetition.getTime();
    });
    return events[0];
  }

  restEvents(events){
    events.sort((a, b) => {
      return b.lastCompetition.getTime() - a.lastCompetition.getTime();
    });
    return events.slice(1);
  }


  color(dance:IDanceSummary){
    return SkillTypes[this.latestEvent(dance.entries).skill].toLowerCase();
  }


}

