import * as cheerio from 'cheerio';
import {DanceEvent} from './entities/DanceEvent';
import {EventNameParser} from './EventNameParser';
import {EventParser} from './EventParser';
import {Individual} from './entities/Individual';
import {DancerRepository} from './DancerRepository';
import {Competition} from './entities/Competition';
import {DivisionTypes, EventSkillTypes} from './entities/Types';
import {ILoading} from '../app/services/data.service';

export interface IHTTP {
  post(url, body): Promise<string>;
}

export interface IDancedEvents {
  division: DivisionTypes;
  eventSkill: EventSkillTypes;
}

export class CompetitionCore {
  name: string;
  date: number;
  linkCode: string;
  dancedEvents: IDancedEvents[] = [];


  constructor(name: string) {
    this.name = name;
  }

  addEvent(event: IDancedEvents) {
    for (let i = 0; i < this.dancedEvents.length; i++) {
      if (this.dancedEvents[i].division === event.division && this.dancedEvents[i].eventSkill === event.eventSkill) {
        return;
      }
    }
    this.dancedEvents.push(event);
  }
}


export class IndividualParser {


  public static parseCompetitions(page: string): CompetitionCore[] {
    const $ = cheerio.load(page);
    const competitions: CompetitionCore[] = [];
    const arr = $('td.t1n').toArray();
    for (let i = 0; i < arr.length; i++) {
      if ($('b', arr[i]).length > 0) {
        const eventName = $('b', arr[i]).get(0).firstChild.data;
        const cmp = new CompetitionCore(eventName);
        const matched = eventName.match(/^[0-9]+(-[0-9]+)+/);
        if (matched !== null) {
          const nums = matched[0].split(('-'));
          cmp.date = (new Date((parseInt(nums[2], 10) < 60 ? parseInt(nums[2], 10) + 2000 : parseInt(nums[2], 10)),
            parseInt(nums[0], 10) - 1,
            parseInt(nums[1], 10))).getTime();
        }

        competitions.push(cmp);
        continue;
      }
      if ($('a', arr[i]).length > 0 && competitions.length > 0) {
        const event = EventNameParser.parse($('a', arr[i]).get(0).firstChild.data);
        const href = $('a', arr[i]).get(0).attribs['href'];
        let eventLink = href.substring(href.indexOf('event=') + 6);
        eventLink = eventLink.substring(0, eventLink.indexOf('&'));
        const cmp = competitions[competitions.length - 1];
        cmp.addEvent(event);
        cmp.linkCode = eventLink;
      }
    }
    return competitions;
  }


  public static async parse(firstName: string, lastName: string, http: IHTTP, progress: (loading: ILoading) => void = () => {
  }): Promise<Individual> {
    const url = 'http://results.o2cm.com/individual.asp?szLast=' + lastName + '&szFirst=' + firstName;
    progress({
      url: url,
      current: 0
    });
    const page = await http.post(url, '');
    const compCores = this.parseCompetitions(page);
    const comps: Competition[] = [];

    const dancer = DancerRepository.Instance.createOrGet(firstName + ' ' + lastName);
    for (let i = 0; i < compCores.length; i++) {
      const cmp = new Competition(compCores[i]);
      progress({
        url: EventParser.getUrl(cmp.linkCode),
        current: i + 1,
        maximum: compCores.length,
        details: cmp.name
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
      cmp.DanceEvents = des.filter(e => e.hasDancer(dancer));
      comps.push(cmp);
    }

    return new Individual(firstName, lastName, comps);
  }
}
