import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CompetitionCore, IHTTP, IndividualParser} from '../../../common/o2cm-parser/IndividualParser';
import {HttpClient} from '@angular/common/http';
import {DanceEvent, IDanceEvent} from '../../../common/o2cm-parser/entities/DanceEvent';
import {DancerName, IData, ILoading} from './IData';
import {QueryParams} from '../QueryParams';
import {RegistrationParser} from '../../../common/o2cm-parser/RegistrationParser';
import {ISummary} from './ISummary';
import {Dancer} from '../../../common/o2cm-parser/entities/Dancer';

@Injectable()
export class RegistrationService {


  private readonly proxyHTTP: IHTTP;
  public summaries: BehaviorSubject<{ [key: string]: ISummary }> = new BehaviorSubject<{ [p: string]: ISummary }>({});
  private que: DancerName[] = [];

  queryParams = {};
  private loading = false;


  constructor(private http: HttpClient) {
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
  }

  getDances(eventId: string): Promise<DanceEvent[]> {
    return RegistrationParser.parse(eventId, this.proxyHTTP);
  }


  loadSummary(dancer: DancerName) {
    const key = Dancer.toKey(dancer);
    if (!this.summaries.getValue()[key]) {
      this.que.push(dancer);
    }
    this.runLoad();
  }

  async runLoad() {
    if (this.loading === true) {
      return;
    }
    this.loading = true;

    while (this.que.length > 0) {
      const dancer = this.que.shift();
      const key = Dancer.toKey(dancer);
      if (this.summaries.getValue()[key]) {
        continue;
      }
      try {
        this.summaries.getValue()[key] = await this.http.get('/api/summary?' + QueryParams.name.firstName + '=' + dancer.firstName +
          '&' + QueryParams.name.lastName + '=' + dancer.lastName).toPromise();
        this.summaries.next(this.summaries.getValue());
      } catch (err) {
        console.error(err);
      }
    }

    this.loading = false;
  }
}
