import {Injectable} from '@angular/core';
import {StyleTypes} from '../../o2cm-parser/entities/Types';
import {IDanceSummary, IEventSummary, IPointSummary, IStyleSummary, ISummary} from './ISummary';
import {Individual} from '../../o2cm-parser/entities/Individual';
import {DanceEvent} from '../../o2cm-parser/entities/DanceEvent';
import {Rules} from './Rules';
import {ICompetitionList, IDanceList, IData} from './IData';

@Injectable()
export class DataParserService {

  public static VERSION = '1.5';


  constructor() {

  }

  public mergeDate(base: IData, extend: IData): IData {
    base.competitions = base.competitions.concat(extend.competitions);
    base.competitions = base.competitions.sort((a, b) => b.competition.date - a.competition.date);

    for (const style in extend.summary) {
      if (!extend.summary.hasOwnProperty(style)) {
        continue;
      }
      if (!base.summary.hasOwnProperty(style)) {
        base.summary[style] = extend.summary[style];
        continue;
      }
      const eDances: IDanceSummary[] = extend.summary[style].dances;
      const bDances: IDanceSummary[] = base.summary[style].dances;

      for (let i = 0; i < eDances.length; i++) {
        let foundIndex = null;
        for (let j = 0; j < bDances.length; j++) {
          if (bDances[j].dance === eDances[i].dance) {
            foundIndex = j;
            break;
          }
        }
        if (foundIndex === null) {
          bDances.push(eDances[i]);
          continue;
        }

        const mergePoints = (b: IPointSummary, e: IPointSummary): IPointSummary => {
          b.overall += e.overall;
          for (let k = 0; k < b.details.length; k++) {
            for (let l = 0; l < e.details.length; l++) {
              if (b.details[k].pointSkill === e.details[l].pointSkill) {
                b.details[k].points += e.details[l].points;
              }
            }
          }

          return b;
        };

        for (let k = 0; k < eDances[i].entries.length; k++) {
          const eEntry = eDances[i].entries[k];
          let found = false;
          for (let l = 0; l < bDances[foundIndex].entries.length; l++) {
            const bEntry = bDances[foundIndex].entries[l];
            if (bEntry.pointSkill === eEntry.pointSkill) {
              bEntry.points = mergePoints(bEntry.points,
                eEntry.points);

              if (bEntry.lastCompetition < eEntry.lastCompetition) {
                bEntry.lastCompetition = eEntry.lastCompetition;
              }
              if (bEntry.startTime > eEntry.startTime && eEntry.startTime !== null) {
                bEntry.startTime = eEntry.startTime;
              }
              found = true;
              break;
            }
          }
          if (!found) {
            bDances[foundIndex].entries.push(eEntry);
          }
        }
      }

    }

    return base;
  }


  public parseDancer(person: Individual): IData {
    const summary = this.getSummary(person);
    const comps = this.getCompetitions(person);
    return <IData>{
      dancerName: person.dancer,
      summary: summary,
      competitions: comps
    };
  }

  private getCompetitions(person: Individual) {
    const comps: ICompetitionList[] = [];
    for (let i = 0; i < person.Competitions.length; i++) {
      comps.push({
        competition: person.Competitions[i].toJSONable(),
        dances:
          person.Competitions[i].dancedEvents.map((d) => {
            return <IDanceList>{
              point: d.calcPoint(person.dancer),
              isFinal: d.getPlacement(person.dancer).isFinal,
              coupleCount: d.CoupleCount,
              style: d.style,
              pointSkill: d.pointSkill,
              eventSkill: d.eventSkill.type,
              placement: d.getPlacement(person.dancer).placement,
              dances: d.dances,
              partner: d.getPartner(person.dancer)
            };
          })
      });
    }
    comps.sort((a, b) => b.competition.date - a.competition.date);
    return comps;
  }

  private getSummary(person: Individual) {
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
                if (c.Competition.name.toLowerCase().indexOf(Rules.NoPointExceptions[i].name.toLowerCase()) !== -1) {
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
