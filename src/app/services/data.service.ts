import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {
  AgeTypes, DanceTypes, DivisionTypes, EventSkillTypes, PointSkillTypes,
  StyleTypes
} from '../../o2cm-parser/entities/Types';
import {CompetitionCore, IComparableCompetition, IHTTP, IndividualParser} from '../../o2cm-parser/IndividualParser';
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
import {DataParserService} from './data-loader.service';
import {DancerName, IData, ILoading} from './IData';

@Injectable()
export class DataService {


  public data: BehaviorSubject<IData>;
  public loading: BehaviorSubject<ILoading>;
  private proxyHTTP: IHTTP;


  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private slimLoadingBarService: SlimLoadingBarService,
              private cacheService: CacheService,
              private dataParser: DataParserService) {
    this.proxyHTTP = {
      post: (url: string, body: any): Promise<string> => {
        return this.http.post('/proxy', {url: url, body: body}, {
          responseType: 'text'
        }).toPromise();
      }
    };

    this.data = new BehaviorSubject<IData>({
      dancerName: {
        firstName: '',
        lastName: ''
      }, summary: {},
      competitions: [],
      version: DataParserService.VERSION
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
      new DanceEvent('A dance', DivisionTypes.Amateur, AgeTypes.Adult, EventSkillTypes.Bronze, StyleTypes.Smooth, [DanceTypes.Waltz])
    ];

    this.data.next({
      version: DataParserService.VERSION,
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
              dances: [DanceTypes.Waltz],
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


  public async loadDancer(fistName: string, lastName: string) {
    this.slimLoadingBarService.visible = true;
    this.slimLoadingBarService.start(() => {
      this.slimLoadingBarService.visible = false;
    });
    const name = {
      firstName: fistName,
      lastName: lastName
    };
    const cache: IData = this.cacheService.get(name);
    if (cache && cache.version === DataParserService.VERSION) {
      this.data.next(cache);

      const person = await IndividualParser.parse(name,
        this.proxyHTTP,
        (loading: ILoading) => {
          if (loading.maximum) {
            this.loading.next(loading);
          }
        },
        cache.competitions.map(c => c.competition));
      const partialData = this.dataParser.parseDancer(person);
      this.data.next(this.dataParser.mergeDate(cache, partialData));
      this.cacheService.put(this.data.getValue());
      this.loading.next(null);
      this.slimLoadingBarService.complete();
      return;
    }
    this.data.next({
      dancerName: name,
      summary: {},
      competitions: [],
      version: DataParserService.VERSION
    });
    try {
      const person = await IndividualParser.parse(name,
        this.proxyHTTP,
        (loading: ILoading) => {
          this.loading.next(loading);
        });

      this.data.next(this.dataParser.parseDancer(person));
      this.cacheService.put(this.data.getValue());
      this.slimLoadingBarService.complete();
      this.loading.next(null);


    } catch (err) {
      console.error(err);
    }
  }


}
