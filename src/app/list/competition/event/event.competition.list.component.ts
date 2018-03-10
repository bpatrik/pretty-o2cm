import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DancerName, IDanceList} from '../../../services/IData';
import {Rules} from '../../../services/Rules';
import {DanceTypes, EventSkillTypes, PointSkillTypes, StyleTypes} from '../../../../o2cm-parser/entities/Types';
import {DanceEvent, IDanceEvent, PointWarning} from '../../../../o2cm-parser/entities/DanceEvent';
import {DataService} from '../../../services/data.service';
import {IPlacement, Placement} from '../../../../o2cm-parser/entities/Placement';
import {ICompetition} from '../../../../o2cm-parser/entities/Competition';
import {IPointSummary} from '../../../services/ISummary';
import {RoleType} from '../../../competitors/RoleType';


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
  private dance: IDanceEvent;
  private dancer: DancerName;


  public myPlacement: IPlacement;
  public myPartner: DancerName;
  public myPoint: { value: number, warning: PointWarning };
  @Input() noPointReason: string;
  @Input() compactLayout;
  public color: string;

  @Input() set Dance(dance: IDanceEvent) {
    this.dance = dance;
    this.onUpdate();
  }

  get Dance(): IDanceEvent {
    return this.dance;
  }

  @Input() competition: ICompetition;


  get Dancer(): DancerName {
    return this.dancer;
  }

  @Input() set Dancer(value: DancerName) {
    this.dancer = value;
    this.onUpdate();
  }

  @Input() showPercentage: boolean;
  @Output() pointPresentation = new EventEmitter();


  constructor(public dataService: DataService) {

  }

  onUpdate() {
    if (!this.dance || !this.dancer) {
      return;
    }
    if (window.screen.width < 576) {
      this.compactLayout = true;
    }

    this.myPlacement = DanceEvent.getPlacement(this.dance, this.dancer);
    this.myPartner = Placement.getPartner(this.myPlacement, this.dancer);
    this.myPoint = DanceEvent.calcPointForPlacement(this.dance, this.myPlacement);
    this.color = PointSkillTypes[this.dance.pointSkill].toLowerCase();
  }

  percent() {
    return Math.round((this.dance.placements.length - this.myPlacement.placement) / this.dance.placements.length * 100);
  }

  url() {
    return window.location.origin +
      window.location.pathname +
      '?firstName=' +
      this.myPartner.firstName +
      '&lastName=' +
      this.myPartner.lastName;
  }

  pointWarningStr(): string {
    switch (this.myPoint.warning) {
      case PointWarning.NOQF_W_MANY_COUPELS:
        return 'No quarter final detected, but more then 20 couples were competing';
      case PointWarning.QF_W_FEW_COUPLES:
        return 'Quarter final detected, but too few couples were competing';
    }
    return '';

  }

  renderDances(): string {
    let txt = '';
    for (let i = 0; i < this.dance.dances.length; i++) {
      txt += DanceTypes[this.dance.dances[i]];
      if (i < this.dance.dances.length - 1) {
        txt += ' / ';
      }
    }
    if (txt.length > 10 && this.compactLayout === true) {
      txt = '';
      for (let i = 0; i < this.dance.dances.length; i++) {
        txt += DanceTypes.toLetter[this.dance.dances[i]];
        if (i < this.dance.dances.length - 1) {
          txt += '/';
        }
      }
    }
    return txt;
  }


  partnerRoleImg(): string {
    if (this.myPartner === this.myPlacement.leader) {
      return 'leader.svg';
    } else if (this.myPartner === this.myPlacement.follower) {
      return 'follower.svg';
    }
    return 'couple.svg';
  }


}

