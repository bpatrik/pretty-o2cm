import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {
  AgeTypes, DanceEvent, Dancer, DanceTypes, DivisionTypes, SkillTypes,
  StyleTypes
} from '../../o2cm-parser/entities/DanceEvent';
import {CompetitionCore, IndividualParser} from '../../o2cm-parser/IndividualParser';
import {Http} from '@angular/http';
import {HttpClient} from '@angular/common/http';
import {IDanceSummary, IEventSummary, IPointSummary, IStyleSummary, ISummary} from './ISummary';
import {Competition} from '../../o2cm-parser/entities/Competition';
import {Individual} from '../../o2cm-parser/entities/Individual';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {Params} from '@angular/router/src/shared';

export interface IDanceList {
  skill: SkillTypes;
  dances: DanceTypes[];
  style: StyleTypes;
  placement: number;
  coupleCount: number;
  isFinal: boolean;
  point: number;
}

export interface ICompetitionList {
  competition: Competition;
  dances: IDanceList[];
}

export interface DancerName {
  firstName: string;
  lastName: string;
}

@Injectable()
export class DataService {

  public summary: BehaviorSubject<ISummary>;
  public competitions: BehaviorSubject<ICompetitionList[]>;
  public dancerName: BehaviorSubject<DancerName>;


  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private slimLoadingBarService: SlimLoadingBarService) {
    this.summary = new BehaviorSubject<ISummary>({});
    this.competitions = new BehaviorSubject<ICompetitionList[]>([]);

    this.dancerName = new BehaviorSubject<DancerName>({
      firstName: '',
      lastName: ''
    });

    route.queryParams.subscribe((value: Params) => {
      if (value['firstName'] && value['lastName'] &&
        value['firstName'] !== this.dancerName.getValue().firstName &&
        value['lastName'] !== this.dancerName.getValue().lastName) {
        this.dancerName.next({firstName: value['firstName'], lastName: value['lastName']});
      }
    });
    this.dancerName.subscribe((value) => {
      if (value.firstName === '' || value.lastName === '') {
        return;
      }
      this.router.navigate([], {
        queryParams: {firstName: value.firstName, lastName: value.lastName}
      });
      this._loadDancer(value.firstName, value.lastName);
    });
    // this.loadData();
    // this.loadDummy();

  }

  loadDummy() {
    this.dancerName.next({firstName: 'Patrik', lastName: 'Braun'});
    this.summary = new BehaviorSubject<ISummary>({
      Latin: {
        style: StyleTypes.Latin,
        dances: [{
          dance: DanceTypes.Rumba,
          entries: [{
            skill: SkillTypes.Newcomer,
            startTime: new Date(),
            lastCompetition: new Date(),
            points: {overall: 2, details: []}
          }, {
            skill: SkillTypes.Bronze,
            startTime: new Date(),
            lastCompetition: new Date(Date.now() - 1000),
            points: {overall: 2, details: []}
          }]
        },
          {
            dance: DanceTypes.ChaCha,
            entries: [{
              skill: SkillTypes.Silver,
              startTime: new Date(),
              lastCompetition: new Date(Date.now() - 1000),
              points: {overall: 2, details: []}
            }, {
              skill: SkillTypes.Bronze,
              startTime: new Date(),
              lastCompetition: new Date(Date.now()),
              points: {overall: 2, details: []}
            }]
          }
        ]

      }
    });

    const comp = new Competition(new CompetitionCore('BU comp'));
    comp.date = new Date();
    comp.dancedEvents = [
      new DanceEvent('A dance', DivisionTypes.Amateur, AgeTypes.Adult, SkillTypes.Bronze, StyleTypes.Smooth, [DanceTypes.Walz])
    ];
    this.competitions = new BehaviorSubject<ICompetitionList[]>([
      {
        competition: comp,
        dances: [
          {
            skill: SkillTypes.Bronze,
            dances: [DanceTypes.Walz],
            style: StyleTypes.Smooth,
            placement: 2,
            coupleCount: 20,
            isFinal: true,
            point: 2
          },
          {
            skill: SkillTypes.Bronze,
            dances: [DanceTypes.Tango],
            style: StyleTypes.Smooth,
            placement: 12,
            coupleCount: 20,
            isFinal: false,
            point: 2
          }
        ]
      }
    ]);
  }

  public loadDancer(fistName: string, lastName: string) {
    this.dancerName.next({firstName: fistName, lastName: lastName});
  }

  private async _loadDancer(fistName: string, lastName: string) {
    this.slimLoadingBarService.visible = true;
    this.slimLoadingBarService.start(() => {
      this.slimLoadingBarService.visible = false;
    });
    this.competitions.next([]);
    this.summary.next({});
    try {
      const person = await IndividualParser.parse(fistName,
        lastName,
        {
          post: (url: string, body: any): Promise<string> => {
            return this.http.post('/proxy', {url: url, body: body}, {
              responseType: 'text'
            }).toPromise();
          }
        });
      this.createSummary(person);
      this.loadCompetitions(person);

      this.slimLoadingBarService.complete();
    } catch (err) {
      console.error(err);
    }
  }

  private loadCompetitions(person: Individual) {
    const comps: ICompetitionList[] = [];
    for (let i = 0; i < person.Competitions.length; i++) {
      comps.push({
        competition: person.Competitions[i],
        dances:
          person.Competitions[i].dancedEvents.map((d) => {
            return <IDanceList>{
              point: d.calcPoint(person.dancer),
              isFinal: d.getPlacement(person.dancer).isFinal,
              coupleCount: d.CoupleCount,
              style: d.style,
              skill: d.skill,
              placement: d.getPlacement(person.dancer).placement,
              dances: d.dances
            };
          })
      });
    }
    comps.sort((a, b) => b.competition.date.getTime() - a.competition.date.getTime());
    this.competitions.next(comps);
  }

  private createSummary(person: Individual) {
    const styles = person.Styles;
    const summary: ISummary = {};
    for (let style in styles) {
      const danceSummaries: IDanceSummary[] = [];

      const tmp: { [key: number]: { [key: number]: DanceEvent[] } } = {};

      for (let i = 0; i < styles[style].length; i++) {
        const danceEvent: DanceEvent = styles[style][i];
        for (let j = 0; j < danceEvent.dances.length; j++) {
          tmp[danceEvent.dances[j]] = tmp[danceEvent.dances[j]] || {};
          tmp[danceEvent.dances[j]][danceEvent.skill] = tmp[danceEvent.dances[j]][danceEvent.skill] || [];
          tmp[danceEvent.dances[j]][danceEvent.skill].push(danceEvent);
        }
      }

      for (let danceType in  tmp) {
        let entries: IEventSummary[] = [];


        for (let danceSkill in tmp[danceType]) {

          let points: IPointSummary = {
            overall: 0,
            details: []
          };
          for (let ds in tmp[danceType]) {
            const p = tmp[danceType][ds].reduce((p, c) => p + c.calcPoint(person.dancer, <any>parseInt(danceSkill)), 0);
            points.overall += p;
            if (p > 0) {
              points.details.push({skill: parseInt(ds), points: p});
            }
          }

          const sorted = tmp[danceType][danceSkill].sort((a, b) => a.Competition.date.getTime() - b.Competition.date.getTime());

          entries.push({
            skill: <any>danceSkill,
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
    this.summary.next(summary);
  }

}
