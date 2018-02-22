import {ISummary} from './ISummary';
import {ICompetition} from '../../o2cm-parser/entities/Competition';
import {DanceTypes, EventSkillTypes, PointSkillTypes, StyleTypes} from '../../o2cm-parser/entities/Types';


export interface IDanceList {
  pointSkill: PointSkillTypes;
  eventSkill: EventSkillTypes;
  dances: DanceTypes[];
  style: StyleTypes;
  placement: number;
  coupleCount: number;
  isFinal: boolean;
  point: number;
  partner: DancerName;
}

export interface ICompetitionList {
  competition: ICompetition;
  dances: IDanceList[];
}

export interface DancerName {
  firstName: string;
  lastName: string;
}

export interface IData {
  dancerName: DancerName;
  summary: ISummary;
  competitions: ICompetitionList[];
  version: string;
}


export interface ILoading {
  current: number;
  maximum?: number;
  url: string;
  details?: string;
}
