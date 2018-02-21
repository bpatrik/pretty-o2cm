import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {
  AgeTypes, DanceTypes, DivisionTypes, EventSkillTypes, PointSkillTypes,
  StyleTypes
} from '../../o2cm-parser/entities/Types';
import {CompetitionCore, IndividualParser} from '../../o2cm-parser/IndividualParser';
import {HttpClient} from '@angular/common/http';
import {IDanceSummary, IEventSummary, IPointSummary, IStyleSummary, ISummary} from './ISummary';
import {Competition, ICompetition} from '../../o2cm-parser/entities/Competition';
import {Individual} from '../../o2cm-parser/entities/Individual';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {ActivatedRoute, Data, Router} from '@angular/router';
import {Params} from '@angular/router/src/shared';
import {DanceEvent, Dancer} from '../../o2cm-parser/entities/DanceEvent';
import {CacheService} from './cache.service';
import {Rules} from './Rules';

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

@Injectable()
export class DataService {

  private static VERSION = '1';

  public data: BehaviorSubject<IData>;
  public loading: BehaviorSubject<ILoading>;


  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private slimLoadingBarService: SlimLoadingBarService,
              private cacheService: CacheService) {

    this.data = new BehaviorSubject<IData>({
      dancerName: {
        firstName: '',
        lastName: ''
      }, summary: {},
      competitions: [],
      version: DataService.VERSION
    });
    this.loading = new BehaviorSubject<ILoading>(null);

    route.queryParams.subscribe((value: Params) => {
      if (value['firstName'] && value['lastName'] &&
        value['firstName'] !== this.data.getValue().dancerName.firstName &&
        value['lastName'] !== this.data.getValue().dancerName.lastName) {
        this.loadDancer(value['firstName'], value['lastName']);
      }
    });

    this.data.subscribe((value) => {
      if (value.dancerName.firstName === '' || value.dancerName.lastName === '') {
        return;
      }
      this.router.navigate([], {
        queryParams: {firstName: value.dancerName.firstName, lastName: value.dancerName.lastName}
      });
    });
    // this.loadData();
    // this.loadDummy();

  }

  loadDummy() {
    const comp = new Competition(new CompetitionCore('BU comp'));
    comp.date = Date.now();
    comp.dancedEvents = [
      new DanceEvent('A dance', DivisionTypes.Amateur, AgeTypes.Adult, EventSkillTypes.Bronze, StyleTypes.Smooth, [DanceTypes.Walz])
    ];

    this.data.next({
      version: DataService.VERSION,
      dancerName: {firstName: 'Patrik', lastName: 'Braun'},
      summary: {
        Latin: {
          style: StyleTypes.Latin,
          dances: [{
            dance: DanceTypes.Rumba,
            entries: [{
              pointSkill: PointSkillTypes.Newcomer,
              startTime: Date.now(),
              lastCompetition: Date.now(),
              points: {overall: 2, details: []}
            }, {
              pointSkill: PointSkillTypes.Bronze,
              startTime: Date.now(),
              lastCompetition: Date.now() - 1000,
              points: {overall: 2, details: []}
            }]
          },
            {
              dance: DanceTypes.ChaCha,
              entries: [{
                pointSkill: PointSkillTypes.Silver,
                startTime: Date.now(),
                lastCompetition: Date.now() - 1000,
                points: {overall: 2, details: []}
              }, {
                pointSkill: PointSkillTypes.Bronze,
                startTime: Date.now(),
                lastCompetition: Date.now(),
                points: {overall: 2, details: []}
              }]
            }
          ]

        }
      }, competitions: [
        {
          competition: comp,
          dances: [
            {
              pointSkill: PointSkillTypes.Bronze,
              eventSkill: EventSkillTypes.Bronze,
              dances: [DanceTypes.Walz],
              style: StyleTypes.Smooth,
              placement: 2,
              coupleCount: 20,
              isFinal: true,
              point: 2,
              partner: {firstName: 'Test', lastName: 'John'}
            },
            {
              pointSkill: PointSkillTypes.Bronze,
              eventSkill: EventSkillTypes.Bronze,
              dances: [DanceTypes.Tango],
              style: StyleTypes.Smooth,
              placement: 12,
              coupleCount: 20,
              isFinal: false,
              point: 2,
              partner: {firstName: 'Test', lastName: 'John'}
            }
          ]
        }
      ]
    });

  }

  public loadDancer(fistName: string, lastName: string) {
    this._loadDancer({
      firstName: fistName,
      lastName: lastName
    });
  }

  private async _loadDancer(name: DancerName) {

    const cache = this.cacheService.get(name);
    if (cache && cache.version === DataService.VERSION) {
      return this.data.next(cache);
    }
    this.slimLoadingBarService.visible = true;
    this.slimLoadingBarService.start(() => {
      this.slimLoadingBarService.visible = false;
    });
    this.data.next({
      dancerName: name,
      summary: {},
      competitions: [],
      version: DataService.VERSION
    });
    try {
      const person = await IndividualParser.parse(name.firstName, name.lastName,
        {
          post: (url: string, body: any): Promise<string> => {
            return this.http.post('/proxy', {url: url, body: body}, {
              responseType: 'text'
            }).toPromise();
          }
        }, (loading) => {
          this.loading.next(loading);
        });
      const summary = this.getSummary(person);
      const comps = this.getCompetitions(person);
      this.data.next({
        dancerName: name,
        summary: summary,
        competitions: comps,
        version: DataService.VERSION
      });
      this.cacheService.put(this.data.getValue());
      this.slimLoadingBarService.complete();
      this.loading.next(null);
    } catch (err) {
      console.error(err);
    }
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
              eventSkill: d.eventSkill,
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
        const entries: IEventSummary[] = [];


        for (const danceSkill in tmp[danceType]) {
          const points: IPointSummary = {
            overall: 0,
            details: []
          };
          for (const ds in tmp[danceType]) {
            const p = tmp[danceType][ds].reduce((prev, c) => {
              for (let i = 0; i < Rules.NoPointExceptions.length; i++) {
                if (c.Competition.name.toLowerCase().indexOf(Rules.NoPointExceptions[i].name.toLowerCase()) !== -1) {
                  return prev;
                }
              }
              return prev + c.calcPoint(person.dancer, <any>parseInt(danceSkill, 10));
            }, 0);
            points.overall += p;
            if (p > 0) {
              points.details.push({pointSkill: parseInt(ds, 10), points: p});
            }
          }

          const sorted = tmp[danceType][danceSkill].sort((a, b) =>
            a.Competition.date - b.Competition.date);

          entries.push({
            pointSkill: <any>danceSkill,
            points: points,
            startTime: sorted[0].Competition.date,
            lastCompetition: sorted[sorted.length - 1].Competition.date,
          });
        }
        danceSummaries.push({
          dance: <any>danceType,
          entries: entries
        });
      }
      summary[StyleTypes[style]] = <IStyleSummary>{style: <any>style, dances: danceSummaries};
    }
    return summary;
  }

}
