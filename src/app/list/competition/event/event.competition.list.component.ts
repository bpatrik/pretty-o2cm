import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IDanceList} from '../../../services/IData';
import {Rules} from '../../../services/Rules';
import {DanceTypes, EventSkillTypes, PointSkillTypes, StyleTypes} from '../../../../o2cm-parser/entities/Types';


@Component({
  selector: 'app-competition-event',
  templateUrl: './event.competition.list.component.html',
  styleUrls: ['./event.competition.list.component.scss'],
})
export class CompetitionEventComponent {

  StyleTypes = StyleTypes;
  DanceTypes = DanceTypes;
  PointSkillTypes = PointSkillTypes;
  EventSkillTypes = EventSkillTypes;
  Rules = Rules;


  @Input() noPointReason: string;
  @Input() dance: IDanceList;
  @Input() showPercentage: boolean;
  @Output() pointPresentation = new EventEmitter();

  color() {
    return PointSkillTypes[this.dance.pointSkill].toLowerCase();
  }

  percent() {
    return Math.round((this.dance.coupleCount - this.dance.placement) / this.dance.coupleCount * 100);
  }

  url() {
    return window.location.origin +
      window.location.pathname +
      '?firstName=' +
      this.dance.partner.firstName +
      '&lastName=' +
      this.dance.partner.lastName;
  }


}
