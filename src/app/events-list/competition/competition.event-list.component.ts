import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ICompetitionList} from '../../services/IData';
import {Rules} from '../../services/Rules';


@Component({
  selector: 'competition-event-list',
  templateUrl: './competition.event-list.component.html',
  styleUrls: ['./competition.event-list.component.scss'],
})
export class CompetitionEventListComponent {

  @Output() pointPresentation = new EventEmitter();
  @Input() showPercentage: boolean;
  @Input() competition: ICompetitionList;

  noPointReason() {
    for (let i = 0; i < Rules.NoPointExceptions.length; i++) {
      if (this.competition.competition.name.toLowerCase().indexOf(Rules.NoPointExceptions[i].name.toLowerCase()) !== -1) {
        return Rules.NoPointExceptions[i].reason;
      }
    }
    return null;
  }
}

