import {Component, EventEmitter, Input, Output} from "@angular/core";
import {IDanceList} from "../../../services/data.service";
import {Rules} from "../../../services/Rules";
import {DanceTypes, SkillTypes, StyleTypes} from "../../../../o2cm-parser/entities/DanceEvent";


@Component({
  selector: 'competition-event',
  templateUrl: './event.competition.list.component.html',
  styleUrls: ['./event.competition.list.component.scss'],
})
export class CompetitionEventComponent {

  StyleTypes = StyleTypes;
  DanceTypes = DanceTypes;
  SkillTypes = SkillTypes;
  Rules = Rules;


  @Input() dance: IDanceList;
  @Input() showPercentage: boolean;
  @Output() pointPresentation = new EventEmitter();

  color() {
    return SkillTypes[this.dance.skill].toLowerCase();
  }

  percent(){
    return Math.round((this.dance.coupleCount - this.dance.placement) / this.dance.coupleCount *100);
  }
}

