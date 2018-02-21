import {DanceTypes, PointSkillTypes, StyleTypes} from '../../o2cm-parser/entities/Types';

export interface IPointSummary {
  overall: number;
  details: { pointSkill: PointSkillTypes, points: number }[];
}

export interface IEventSummary {
  pointSkill: PointSkillTypes;
  points: IPointSummary;
  startTime: number;
  lastCompetition: number;
}


export interface IDanceSummary {
  dance: DanceTypes;
  entries: IEventSummary[];
}

export interface IStyleSummary {
  style: StyleTypes;
  dances: IDanceSummary[];
}

export interface ISummary {
  Rhythm?: IStyleSummary;
  Latin?: IStyleSummary;
  Smooth?: IStyleSummary;
  Standard?: IStyleSummary;
}
