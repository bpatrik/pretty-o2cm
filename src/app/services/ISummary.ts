import {DanceTypes, SkillTypes, StyleTypes} from "../../o2cm-parser/entities/DanceEvent";

export interface IPointSummary {
  overall: number;
  details: { skill: SkillTypes, points: number }[];
}

export interface IEventSummary {
  skill: SkillTypes;
  points: IPointSummary;
  startTime: Date;
  lastCompetition: Date;
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
