import {Component, Input} from "@angular/core";
import {DataService} from "../../services/data.service";
import {DanceTypes, SkillTypes, StyleTypes} from "../../../o2cm-parser/entities/DanceEvent";
import {Rules} from "../../services/Rules";
import {IEventSummary} from "../../services/ISummary";


@Component({
  selector: 'style-panel-entry',
  templateUrl: './entry.style-panel.component.html',
  styleUrls: ['./entry.style-panel.component.scss'],
})
export class StylePanelEntryComponent {


  @Input() eventSummary: IEventSummary;
  @Input() danceType: DanceTypes;
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

  restEvents(events) {
    events.sort((a, b) => {
      return b.lastCompetition.getTime() - a.lastCompetition.getTime();
    });
    return events.slice(1);
  }

  daysLeft(event: IEventSummary) {
    let length = Rules.Timeout[event.skill];
    let left = (event.startTime.getTime() + length) - Date.now();
    if (left <= 0) {
      return -1;
    }
    return Math.ceil(left / 1000 / 60 / 60 / 24);
  }

  progress() {
    let timeP = 0;
    let pointP = 0;
    if (Rules.Timeout[this.eventSummary.skill]) {
      let length = Rules.Timeout[this.eventSummary.skill];
      let left = (this.eventSummary.startTime.getTime() + length) - Date.now();
      timeP = (length - left) / length;
    }
    if (Rules.MaxPoints[this.eventSummary.skill]) {
      pointP = this.eventSummary.points.overall / Rules.MaxPoints[this.eventSummary.skill];
    }
    return Math.round(Math.max(timeP, pointP) * 100);
  }

  color() {
    return SkillTypes[this.eventSummary.skill].toLowerCase();
  }


}

