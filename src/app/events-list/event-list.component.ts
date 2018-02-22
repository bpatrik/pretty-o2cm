import {Component} from '@angular/core';
import {DataService, ICompetitionList} from '../services/data.service';
import {DanceTypes, PointSkillTypes, StyleTypes} from '../../o2cm-parser/entities/Types';
import {Utils} from '../../Utils';
import {ICompetition} from '../../o2cm-parser/entities/Competition';
import {ActivatedRoute} from '@angular/router';
import {Params} from '@angular/router/src/shared';


@Component({
  selector: 'event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent {

  PointSkillTypesArray;
  StyleTypesArray;
  DanceTypesArray;
  danceFilter = -1;
  styleFilter = -1;
  skillFilter = -1;
  isFinalsFilter = -1;
  filteredComps: ICompetitionList[];

  constructor(public dataService: DataService,
              private route: ActivatedRoute) {
    this.PointSkillTypesArray = Utils.enumToArray(PointSkillTypes);
    this.StyleTypesArray = Utils.enumToArray(StyleTypes);
    this.DanceTypesArray = Utils.enumToArray(DanceTypes);
    this.PointSkillTypesArray.unshift({key: -1, value: 'Skill filter'});
    this.StyleTypesArray.unshift({key: -1, value: 'Style filter'});
    this.DanceTypesArray.unshift({key: -1, value: 'Dance filter'});
    this.dataService.data.subscribe(() => {
      this.updateFiltered();
    });
    route.queryParams.subscribe((value: Params) => {
      if (value['danceFilter']) {
        this.danceFilter = parseInt(value['danceFilter'] + '', 10);
      }
      if (value['styleFilter']) {
        this.styleFilter = parseInt(value['styleFilter'] + '', 10);
      }
      if (value['skillFilter']) {
        this.skillFilter = parseInt(value['skillFilter'] + '', 10);
      }
      if (value['isFinalsFilter']) {
        this.isFinalsFilter = parseInt(value['isFinalsFilter'] + '', 10);
      }
      this.updateFiltered();
    });
  }

  showPercentage = false;

  onPointPresentatoinChange() {
    console.log('change', this.showPercentage);
    this.showPercentage = !this.showPercentage;
  }

  updateFiltered() {
    this.danceFilter = parseInt(this.danceFilter + '', 10);
    this.styleFilter = parseInt(this.styleFilter + '', 10);
    this.skillFilter = parseInt(this.skillFilter + '', 10);
    this.isFinalsFilter = parseInt(this.isFinalsFilter + '', 10);
    this.filteredComps = this.dataService.data.value.competitions.map((cl) => {
      return {
        dances: cl.dances.filter((d) => {
          if (this.danceFilter !== -1 && d.dances.indexOf(this.danceFilter) === -1) {
            return false;
          }
          if (this.styleFilter !== -1 && d.style !== this.styleFilter) {
            return false;
          }
          if (this.skillFilter !== -1 && d.pointSkill !== this.skillFilter) {
            return false;
          }
          if (this.isFinalsFilter !== -1 && d.isFinal !== (this.isFinalsFilter === 0)) {
            return false;
          }
          return true;
        }),
        competition: cl.competition
      };
    }).filter((cl) => cl.dances.length > 0);
  }
}

