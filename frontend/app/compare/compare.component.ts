import {Component} from '@angular/core';
import {DataService} from '../services/data.service';
import {ActivatedRoute} from '@angular/router';
import {Params} from '@angular/router/src/shared';
import {DancerName} from '../services/IData';
import {Competition, ICompetition} from '../../../common/o2cm-parser/entities/Competition';
import {DanceEvent} from '../../../common/o2cm-parser/entities/DanceEvent';
import {Dancer} from '../../../common/o2cm-parser/entities/Dancer';
import {QueryParams} from '../QueryParams';


@Component({
  selector: 'app-compare-component',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent {

  showPercentage = false;

  competitor: DancerName;
  filteredCompetitions: ICompetition[] = [];

  constructor(public dataService: DataService,
              private route: ActivatedRoute) {

    route.queryParams.subscribe((value: Params) => {
      if (value[QueryParams.competitor.firstName] && value[QueryParams.competitor.lastName] &&
        !this.competitor || (value[QueryParams.competitor.firstName] !== this.competitor.firstName &&
          value[QueryParams.competitor.lastName] !== this.competitor.lastName)) {
        this.competitor = {
          firstName: value[QueryParams.competitor.firstName],
          lastName: value[QueryParams.competitor.lastName]
        };
        this.onUpdate();
      }
    });
  }

  onUpdate() {
    this.filteredCompetitions = this.dataService.data.getValue().competitions.map(c => {
      const cClone: ICompetition = Competition.shallowCopy(c);
      cClone.dancedEvents = cClone.dancedEvents.filter(d => DanceEvent.hasDancer(d, this.competitor));
      return cClone;
    }).filter(c => c.dancedEvents.length > 0).sort((a, b) => b.date - a.date);
  }

  onPointPresentatoinChange() {
    this.showPercentage = !this.showPercentage;
  }

}

