import {Component} from '@angular/core';
import {DataService} from '../services/data.service';
import {DanceEvent, IDanceEvent} from '../../../common/o2cm-parser/entities/DanceEvent';
import {DanceTypes, StyleTypes} from '../../../common/o2cm-parser/entities/Types';
import {IDatedDanceEvent} from './panel/IDatedDanceEvent';
import {RoleType} from './RoleType';
import {Dancer} from '../../../common/o2cm-parser/entities/Dancer';
import {Cookie} from 'ng2-cookies';
import {ICompetition} from '../../../common/o2cm-parser/entities/Competition';


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
  public dateStartFilter = 0;
  public dateEndFilter = Date.now();
  public StyleTypes = StyleTypes;
  public DanceTypes = DanceTypes;
  public RoleType = RoleType;
  showInfo = true;
  showExtendedInfo = false;
  now = 0;

  constructor(public dataService: DataService) {
    this.now = Date.now();
    this.dateEndFilter = this.now;
    this.dataService.data.subscribe(() => {
      this.setPotentialRole();
      this.allDance = null;
      this.perStyles = null;
      this.perDance = null;
      // this.setPotentialRole();
    });
    this.setPotentialRole();
    this.showInfo = !Cookie.get('hideInfo');
  }


  setShowInfo(value: boolean) {
    this.showInfo = value;
    if (this.showInfo === false) {
      Cookie.set('hideInfo', 'true');
    }
  }

  updateFiltered() {
    if (this.dateEndFilter < this.dateStartFilter) {
      this.dateEndFilter = this.dateStartFilter;
    }

    this.allDance = null;
    this.perStyles = null;
    this.perDance = null;
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

  get ascComps(): ICompetition[] {
    return this.dataService.data.getValue().competitions.sort((a, b) => a.date - b.date);
  }

  get descComps(): ICompetition[]  {
    return this.dataService.data.getValue().competitions.sort((a, b) => b.date - a.date);
  }

  generateEventsPerStyle() {
    const projection = this.dataService.data.getValue().competitions
      .filter(c => c.date <= this.dateEndFilter &&
        c.date >= this.dateStartFilter)
      .reduce((p, c) => p.concat(c.dancedEvents
        .map((d: IDatedDanceEvent) => {
          d.date = c.date;
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
      .filter(c => c.date <= this.dateEndFilter &&
        c.date >= this.dateStartFilter)
      .reduce((p, c) => p.concat(c.dancedEvents
        .map((d: IDatedDanceEvent) => {
          d.date = c.date;
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
      .competitions.map(c => c.dancedEvents
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
    this.allDance = this.dataService.data.getValue().competitions
      .filter(c => c.date <= this.dateEndFilter &&
        c.date >= this.dateStartFilter)
      .reduce((p, c) => p.concat(c.dancedEvents.map((d: IDatedDanceEvent) => {
        d.date = c.date;
        return d;
      })), []);
  }
}

