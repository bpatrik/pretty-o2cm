import {Component} from '@angular/core';
import {DataService} from '../services/data.service';
import {IDanceEvent} from '../../o2cm-parser/entities/DanceEvent';
import {StyleTypes} from '../../o2cm-parser/entities/Types';
import {IDatedDanceEvent} from './panel/IDatedDanceEvent';


@Component({
  selector: 'app-competitors-component',
  templateUrl: './competitors.component.html',
  styleUrls: ['./competitors.component.scss'],
})
export class CompetitorsComponent {


  StyleTypes = StyleTypes;
  private perStyles: { style: StyleTypes, dances: IDatedDanceEvent[] }[] = [];

  constructor(public dataService: DataService) {
    this.dataService.data.subscribe(() => {
      this.generateEventsPerStyle();
    });
    this.generateEventsPerStyle();
  }

  generateEventsPerStyle() {
    const projection = this.dataService.data.getValue().competitions
      .reduce((p, c) => p.concat(c.competition.dancedEvents
        .map((d: IDatedDanceEvent) => {
          d.date = c.competition.date;
          return d;
        })), [])
      .reduce((p, d: IDanceEvent) => {
        p[d.style] = (p[d.style] || {style: d.style, dances: []});

        p[d.style].dances.push(d);
        return p;
      }, {});

    this.perStyles = Object.values(projection);
  }

}

