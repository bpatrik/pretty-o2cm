import {ISummary} from './ISummary';
import {ICompetition} from '../../../common/o2cm-parser/entities/Competition';
import {DanceTypes, EventSkillTypes, PointSkillTypes, StyleTypes} from '../../../common/o2cm-parser/entities/Types';
import {PointWarning} from '../../../common/o2cm-parser/entities/DanceEvent';


export interface IDanceList {
  pointSkill: PointSkillTypes;
  eventSkill: EventSkillTypes;
  dances: DanceTypes[];
  style: StyleTypes;
  placement: number;
  coupleCount: number;
  isFinal: boolean;
  point: { value: number, warning: PointWarning };
  partner: DancerName;
  compCode: string;
  heatid: string;
}

export interface ICompetitionList {
  competition: ICompetition;
  dances: IDanceList[];
}

export interface DancerName {
  firstName: string;
  lastName: string;
}

export interface IDancer extends DancerName {
  firstName: string;
  lastName: string;
  studio?: string;
}

export interface IData {
  dancerName: DancerName;
  summary: ISummary;
  competitions: ICompetition[];
}


export interface ILoading {
  current: number;
  maximum?: number;
  url: string;
  details?: string;
}
