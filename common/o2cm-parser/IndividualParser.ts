import {DanceEvent, ISkill} from './entities/DanceEvent';
import {EventNameParser} from './EventNameParser';
import {EventParser} from './EventParser';
import {Individual} from './entities/Individual';
import {DancerRepository} from './DancerRepository';
import {Competition} from './entities/Competition';
import {DivisionTypes} from './entities/Types';
import {DancerName, ILoading} from '../../frontend/app/services/IData';
import * as $ from 'jquery';

export interface IHTTP {
  post(url: string, body: string): Promise<string>;
}

export interface IDancedEvents {
  division: DivisionTypes;
  eventSkill: ISkill;
}

export interface IComparableCompetition {
  rawName: string;
  date: number;
  linkCode: string;
}

export class CompetitionCore implements IComparableCompetition {
  rawName: string;
  name: string;
  date: number;
  linkCode: string;
  dancedEvents: IDancedEvents[] = [];


  constructor(rawName: string) {
    this.rawName = rawName;
  }

  addEvent(event: IDancedEvents) {
    for (let i = 0; i < this.dancedEvents.length; i++) {
      if (this.dancedEvents[i].division === event.division && this.dancedEvents[i].eventSkill.str === event.eventSkill.str) {
        return;
      }
    }
    this.dancedEvents.push(event);
  }

  equalsIn(filters: IComparableCompetition[]): boolean {
    for (let i = 0; i < filters.length; i++) {
      if (this.rawName === filters[i].rawName && this.date === filters[i].date && this.linkCode === filters[i].linkCode) {
        return true;
      }
    }
    return false;
  }
}


export class IndividualParser {

  /**
   * It parses the summary page of a dancer. Lists the competitions with its linkCode and all the division+skill pairs for that comp.
   * @param {string} page
   * @returns {CompetitionCore[]}
   */
  public static parseCompetitions(page: string): CompetitionCore[] {
    const $page = $($.parseHTML(page));
    const competitions: CompetitionCore[] = [];
    $page.find('td.t1n').each((index, item) => {
      const $t1n = $(item);
      try {

        // its a competition
        if ($t1n.find('b').length > 0) {
          const eventName = $t1n.find('b').first().html();
          const cmp = new CompetitionCore(eventName);
          const matched = eventName.match(/^[0-9]+(-[0-9]+)+/);
          if (matched !== null) {
            const nums = matched[0].split(('-'));
            cmp.date = (new Date((parseInt(nums[2], 10) < 60 ? parseInt(nums[2], 10) + 2000 : parseInt(nums[2], 10)),
              parseInt(nums[0], 10) - 1,
              parseInt(nums[1], 10))).getTime();

            cmp.name = eventName.replace(matched[0], '').trim();
            if (cmp.name.startsWith('-')) {
              cmp.name = cmp.name.replace('-', '').trim();
            }
          }

          competitions.push(cmp);
          return;
        }

        // its an event. we collect only the event/comp link codes. We collect only unique division+skill pairs
        if ($t1n.find('a').length > 0 && competitions.length > 0) {
          const rawName = $t1n.find('a').first().html();
          const href = $t1n.find('a').attr('href');
          let eventLink = href.substring(href.indexOf('event=') + 6);
          eventLink = eventLink.substring(0, eventLink.indexOf('&'));
          let heatid = href.substring(href.indexOf('heatid=') + 7);
          if (heatid.indexOf('&') !== -1) {
            heatid = heatid.substring(0, heatid.indexOf('&'));
          }
          const event = EventNameParser.parse(rawName, heatid);
          if (event === null) {
            return;
          }
          const cmp = competitions[competitions.length - 1];
          cmp.addEvent(event);
          cmp.linkCode = eventLink;
        }
      } catch (e) {
        console.error(e);
      }
    });
    return competitions;
  }

  /**
   * Loads the vent details by parsing the detailed competition page using the event linkCode and division+skill pairs
   * @param {DancerName} name
   * @param {CompetitionCore[]} compCores
   * @param {IHTTP} http
   * @param {(loading: ILoading) => void} progress
   * @returns {Promise<Competition[]>}
   */
  private static async loadEventDetails(name: DancerName,
                                        compCores: CompetitionCore[],
                                        http: IHTTP,
                                        progress: (loading: ILoading) => void) {
    const comps: Competition[] = [];

    const dancer = DancerRepository.Instance.createOrGet(name.firstName + ' ' + name.lastName);
    for (let i = 0; i < compCores.length; i++) {
      const cmp = new Competition(compCores[i]);
      progress({
        url: EventParser.getUrl(cmp.linkCode),
        current: i + 1,
        maximum: compCores.length,
        details: cmp.rawName
      });
      let des: DanceEvent[] = [];
      for (let j = 0; j < compCores[i].dancedEvents.length; j++) {
        try {
          des = des.concat(await EventParser.parse(compCores[i].linkCode,
            compCores[i].dancedEvents[j].division,
            compCores[i].dancedEvents[j].eventSkill,
            http));
        } catch (err) {
          console.error('Error during parsing: ' + compCores[i].name, 'division: ' + compCores[i].dancedEvents[j].division);
          console.error(err);
        }
      }
      cmp.DanceEvents = des.filter(e => e.hasDancer(dancer) === true);
      comps.push(cmp);
    }
    return comps;
  }

  private static generateRndKey(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4();
  }

  public static async parse(name: DancerName, http: IHTTP, progress: (loading: ILoading) => void = () => {
  }, parsedComps: IComparableCompetition[] = []): Promise<Individual> {
    const url = 'http://results.o2cm.com/individual.asp?szLast=' + name.lastName +
      '&szFirst=' + name.firstName + '&rnd=' + this.generateRndKey();
    progress({
      url: url,
      current: 0
    });
    const page = await http.post(url, '');
    const compCores: CompetitionCore[] = this.parseCompetitions(page).filter(c => !c.equalsIn(parsedComps));

    return new Individual(name.firstName, name.lastName, await this.loadEventDetails(name, compCores, http, progress));
  }
}
