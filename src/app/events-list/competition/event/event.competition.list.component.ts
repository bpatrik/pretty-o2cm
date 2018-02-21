import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DancerName, IDanceList} from '../../../services/data.service';
import {Rules} from '../../../services/Rules';
import {DanceTypes, PointSkillTypes, StyleTypes} from '../../../../o2cm-parser/entities/Types';


@Component({
  selector: 'competition-event',
  templateUrl: './event.competition.list.component.html',
  styleUrls: ['./event.competition.list.component.scss'],
})
export class CompetitionEventComponent {

  StyleTypes = StyleTypes;
  DanceTypes = DanceTypes;
  PointSkillTypes = PointSkillTypes;
  Rules = Rules;


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
    return window.location.origin + window.location.pathname + '?firstName=' + this.dance.partner.firstName + '&lastName=' + this.dance.partner.lastName;
  }

}

