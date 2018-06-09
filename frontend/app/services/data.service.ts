import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {
  AgeTypes, DanceTypes, DivisionTypes, EventSkillTypes, PointSkillTypes,
  StyleTypes
} from '../../../common/o2cm-parser/entities/Types';
import {CompetitionCore, IHTTP, IndividualParser} from '../../../common/o2cm-parser/IndividualParser';
import {HttpClient} from '@angular/common/http';
import {Competition} from '../../../common/o2cm-parser/entities/Competition';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {Params} from '@angular/router/src/shared';
import {DanceEvent} from '../../../common/o2cm-parser/entities/DanceEvent';
import {CacheService} from './cache.service';
import {DataParserService} from './data-loader.service';
import {IData, ILoading} from './IData';
import {QueryParams} from '../QueryParams';

@Injectable()
export class DataService {


  public data: BehaviorSubject<IData>;
  public loading: BehaviorSubject<ILoading>;
  private proxyHTTP: IHTTP;

  queryParams = {};


  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private slimLoadingBarService: SlimLoadingBarService,
              private cacheService: CacheService,
              private dataParser: DataParserService) {
    this.proxyHTTP = {
      post: (url: string, body: any): Promise<string> => {
        return this.http.get('/proxy/' + encodeURIComponent(url), {
          params: {
            body: body
          },
          responseType: 'text'
        }).toPromise();
      }
    };

    this.data = new BehaviorSubject<IData>({
      dancerName: {
        firstName: '',
        lastName: ''
      }, summary: {},
      competitions: []
    });
    this.loading = new BehaviorSubject<ILoading>(null);

    route.queryParams.subscribe((value: Params) => {
      if (value[QueryParams.name.firstName] && value[QueryParams.name.lastName] &&
        value[QueryParams.name.firstName] !== this.data.getValue().dancerName.firstName &&
        value[QueryParams.name.lastName] !== this.data.getValue().dancerName.lastName) {
        this.loadDancer(value[QueryParams.name.firstName], value[QueryParams.name.lastName]);
      }
      this.queryParams[QueryParams.heatid] = value[QueryParams.heatid];
      this.queryParams[QueryParams.compCode] = value[QueryParams.compCode];
      this.queryParams[QueryParams.competitor.lastName] = value[QueryParams.competitor.lastName];
      this.queryParams[QueryParams.competitor.firstName] = value[QueryParams.competitor.firstName];
    });

    this.data.subscribe((value) => {
      if (value.dancerName.firstName === '' || value.dancerName.lastName === '') {
        return;
      }
      const queryParams = this.queryParams;
      queryParams[QueryParams.name.firstName] = value.dancerName.firstName;
      queryParams[QueryParams.name.lastName] = value.dancerName.lastName;
      this.router.navigate([], {
        queryParams: queryParams
      });
    });
    // this.loadData();
    // this.loadDummy();

  }

  loadDummy() {
    const comp = new Competition(new CompetitionCore('BU comp'));
    comp.date = Date.now();
    comp.dancedEvents = [
      new DanceEvent('A dance', 'na', DivisionTypes.Amateur, AgeTypes.Adult, {
        type: EventSkillTypes.Bronze,
        str: ''
      }, StyleTypes.Smooth, [DanceTypes.Waltz])
    ];

    this.data.next({
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
      }, competitions: [comp
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
    if (cache) {
      this.data.next(cache);

      const person = await IndividualParser.parse(name,
        this.proxyHTTP,
        (loading: ILoading) => {
          if (loading.maximum) {
            this.loading.next(loading);
          }
        },
        cache.competitions);
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
      competitions: []
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
