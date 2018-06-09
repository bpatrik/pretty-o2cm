import {DanceTypes, PointSkillTypes, StyleTypes} from '../../../common/o2cm-parser/entities/Types';
import {DanceEvent, IDanceEvent} from '../../../common/o2cm-parser/entities/DanceEvent';

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

export module ISummary {
  export const findPointSummary = (that: ISummary, event: IDanceEvent) => {
    let ssum = null;
    if (event.style === StyleTypes.Latin) {
      ssum = that.Latin;
    }
    if (event.style === StyleTypes.Rhythm) {
      ssum = that.Rhythm;
    }
    if (event.style === StyleTypes.Smooth) {
      ssum = that.Smooth;
    }
    if (event.style === StyleTypes.Standard) {
      ssum = that.Standard;
    }
    if (!ssum) {
      return [];
    }
    const points: IEventSummary[] = [];
    for (let i = 0; i < ssum.dances.length; i++) {
      for (let j = 0; j < event.dances.length; j++) {
        if (ssum.dances[i].dance === event.dances[j]) {
          for (let k = 0; k < ssum.dances[i].entries.length; k++) {
            if (ssum.dances[i].entries[k].pointSkill === event.pointSkill) {
              points.push(ssum.dances[i].entries[k]);
            }

          }
        }
      }
    }
    return points;
  };
}
