import {Component} from '@angular/core';
import {DataService} from '../services/data.service';
import {DanceEvent, IDanceEvent} from '../../o2cm-parser/entities/DanceEvent';
import {DanceTypes, StyleTypes} from '../../o2cm-parser/entities/Types';
import {IDatedDanceEvent} from './panel/IDatedDanceEvent';
import {RoleType} from './RoleType';
import {Placement} from '../../o2cm-parser/entities/Placement';
import {Dancer} from '../../o2cm-parser/entities/Dancer';


@Component({
  selector: 'app-competitors-component',
  templateUrl: './competitors.component.html',
  styleUrls: ['./competitors.component.scss'],
})
export class CompetitorsComponent {


  public perStyles: { style: StyleTypes, dances: IDatedDanceEvent[] }[] = null;
  public perDance: { style: StyleTypes, dance: DanceTypes, dances: IDatedDanceEvent[] }[] = null;
  public allDance: IDatedDanceEvent[] = null;
  public groupByFilter = 0;
  public roleFilter: RoleType = 0;
  public StyleTypes = StyleTypes;
  public DanceTypes = DanceTypes;
  public RoleType = RoleType;

  constructor(public dataService: DataService) {
    this.dataService.data.subscribe(() => {
      this.setPotentialRole();
      this.allDance = null;
      this.perStyles = null;
      // this.setPotentialRole();
    });
    this.setPotentialRole();
  }

  get AllDances(): IDatedDanceEvent[] {
    if (this.allDance == null) {
      this.generateAllDance();
    }
    return this.allDance;
  }

  get PerStyles(): { style: StyleTypes, dances: IDatedDanceEvent[] }[] {
    if (this.perStyles == null) {
      this.generateEventsPerStyle();
    }
    return this.perStyles;
  }

  get PerDance(): { style: StyleTypes, dance: DanceTypes, dances: IDatedDanceEvent[] }[] {
    if (this.perDance == null) {
      this.generateEventsPerDance();
    }
    return this.perDance;
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


  generateEventsPerDance() {
    const projection = this.dataService.data.getValue().competitions
      .reduce((p, c) => p.concat(c.competition.dancedEvents
        .map((d: IDatedDanceEvent) => {
          d.date = c.competition.date;
          return d;
        })), [])
      .reduce((p, d: IDanceEvent) => {
        for (let i = 0; i < d.dances.length; i++) {
          const key = d.style + ':' + d.dances[i];

          p[key] = (p[key] || {style: d.style, dance: d.dances[i], dances: []});

          p[key].dances.push(d);
        }
        return p;
      }, {});

    this.perDance = Object.values(projection);
  }


  setPotentialRole() {
    const me = this.dataService.data.getValue().dancerName;
    const placements = this.dataService.data.getValue()
      .competitions.map(c => c.competition.dancedEvents
        .map(d => DanceEvent.getPlacement(d, me))).reduce((p, c) => p.concat(c), []);
    let role: RoleType = null;

    for (let i = 0; i < placements.length; i++) {
      if (Dancer.equals(placements[i].follower, me)) {
        if (role === null) {
          role = RoleType.Follow;
        } else {
          role = role === RoleType.Follow ? role : RoleType.Mixed;
        }
      } else if (Dancer.equals(placements[i].leader, me)) {
        if (role === null) {
          role = RoleType.Lead;
        } else {
          role = role === RoleType.Lead ? role : RoleType.Mixed;
        }
      }
      if (role === RoleType.Mixed) {
        break;
      }
    }
    this.roleFilter = role;


  }

  private generateAllDance() {
    this.allDance = this.dataService.data.getValue()
      .competitions.reduce((p, c) => p.concat(c.competition.dancedEvents.map((d: IDatedDanceEvent) => {
        d.date = c.competition.date;
        return d;
      })), []);
  }
}

