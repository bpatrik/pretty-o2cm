import {IDanceSummary, IEventSummary, IPointSummary, IStyleSummary, ISummary} from '../frontend/app/services/ISummary';
import {Rules} from '../frontend/app/services/Rules';
import {StyleTypes} from './o2cm-parser/entities/Types';
import {DanceEvent} from './o2cm-parser/entities/DanceEvent';
import {Individual} from './o2cm-parser/entities/Individual';

export class Summary {
  public static get(person: Individual): ISummary {
    const styles = person.Styles;
    const summary: ISummary = {};
    for (const style in styles) {
      if (!styles.hasOwnProperty(style)) {
        continue;
      }
      const danceSummaries: IDanceSummary[] = [];

      const tmp: { [key: number]: { [key: number]: DanceEvent[] } } = {};

      for (let i = 0; i < styles[style].length; i++) {
        const danceEvent: DanceEvent = styles[style][i];
        for (let j = 0; j < danceEvent.dances.length; j++) {
          tmp[danceEvent.dances[j]] = tmp[danceEvent.dances[j]] || {};
          tmp[danceEvent.dances[j]][danceEvent.pointSkill] = tmp[danceEvent.dances[j]][danceEvent.pointSkill] || [];
          tmp[danceEvent.dances[j]][danceEvent.pointSkill].push(danceEvent);
        }
      }

      for (const danceType in  tmp) {
        if (!tmp.hasOwnProperty(danceType)) {
          continue;
        }
        const entries: IEventSummary[] = [];

        const highestSkill = Object.getOwnPropertyNames(tmp[danceType]).map(s => parseInt(s, 10)).sort();

        for (let danceSkill = 0; danceSkill <= highestSkill[highestSkill.length - 1]; danceSkill++) {
          const points: IPointSummary = {
            overall: 0,
            details: []
          };
          for (const ds in tmp[danceType]) {
            if (!tmp[danceType].hasOwnProperty(ds)) {
              continue;
            }
            const p = tmp[danceType][ds].reduce((prev, c) => {
              for (let i = 0; i < Rules.NoPointExceptions.length; i++) {
                if (c.Competition.rawName.toLowerCase().indexOf(Rules.NoPointExceptions[i].name.toLowerCase()) !== -1) {
                  return prev;
                }
              }
              return prev + c.calcPoint(person.dancer, danceSkill).value;
            }, 0);
            points.overall += p;
            if (p > 0) {
              points.details.push({pointSkill: parseInt(ds, 10), points: p});
            }
          }

          let startTime = null;
          let lastCompetition = null;
          if (tmp[danceType].hasOwnProperty(danceSkill)) {
            const sorted = tmp[danceType][danceSkill].sort((a, b) =>
              a.Competition.date - b.Competition.date);
            startTime = sorted[0].Competition.date;
            lastCompetition = sorted[sorted.length - 1].Competition.date;
          }
          entries.push({
            pointSkill: <any>danceSkill,
            points: points,
            startTime: startTime,
            lastCompetition: lastCompetition,
          });
        }
        danceSummaries.push({
          dance: parseInt(danceType, 10),
          entries: entries
        });
      }
      summary[StyleTypes[style]] = <IStyleSummary>{style: <any>style, dances: danceSummaries};
    }
    return summary;
  }
}
