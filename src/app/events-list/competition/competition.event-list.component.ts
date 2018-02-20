import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ICompetitionList} from "../../services/data.service";


@Component({
  selector: 'competition-event-list',
  templateUrl: './competition.event-list.component.html',
  styleUrls: ['./competition.event-list.component.scss'],
})
export class CompetitionEventListComponent{

  @Output() pointPresentation = new EventEmitter();
  @Input() showPercentage: boolean;
  @Input() competition: ICompetitionList;
}

