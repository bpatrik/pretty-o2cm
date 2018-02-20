import * as cheerio from 'cheerio';
import {DanceEvent, DivisionTypes, SkillTypes} from "./entities/DanceEvent";
import {EventNameParser} from "./EventNameParser";
import {EventParser} from "./EventParser";
import {Individual} from "./entities/Individual";
import {DancerRepository} from "./DancerRepository";
import {Competition} from "./entities/Competition";

export interface IHTTP {
  post(url, body): Promise<string>;
}

export interface IDancedEvents {
  division: DivisionTypes,
  skill: SkillTypes
}

export class CompetitionCore {
  name: string;
  date: Date;
  linkCode: string;
  dancedEvents: IDancedEvents[] = [];


  constructor(name: string) {
    this.name = name;
  }

  addEvent(event: IDancedEvents) {
    for (let i = 0; i < this.dancedEvents.length; i++) {
      if (this.dancedEvents[i].division == event.division && this.dancedEvents[i].skill == event.skill) {
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
    const arr = $(".t1n").toArray();
    for (let i = 0; i < arr.length; i++) {
      if ($("b", arr[i]).length > 0) {
        let eventName = $("b", arr[i]).get(0).firstChild.data;
        let cmp = new CompetitionCore(eventName);
        let matched = eventName.match(/^[0-9]+(-[0-9]+)+/);
        if (matched !== null) {
          let nums = matched[0].split(("-"));
          cmp.date = new Date((parseInt(nums[2]) < 60 ? parseInt(nums[2]) + 2000 : parseInt(nums[2])),
            parseInt(nums[0]) - 1,
            parseInt(nums[1]));
        }

        competitions.push(cmp);
        continue;
      }
      if ($("a", arr[i]).length > 0 && competitions.length > 0) {
        let event = EventNameParser.parse($("a", arr[i]).get(0).firstChild.data);
        let href = $("a", arr[i]).get(0).attribs['href'];
        let eventLink = href.substring(href.indexOf("event=") + 6);
        eventLink = eventLink.substring(0, eventLink.indexOf("&"));
        let cmp = competitions[competitions.length - 1];
        cmp.addEvent(event);
        cmp.linkCode = eventLink;
      }
    }
    return competitions;
  }

  public static async parse(firstName: string, lastName: string, http: IHTTP): Promise<Individual> {
    const page = await http.post("http://results.o2cm.com/individual.asp?szLast=" + lastName + "&szFirst=" + firstName, "");
    let compCores = this.parseCompetitions(page);
    let comps: Competition[] = [];

    let dancer = DancerRepository.Instance.createOrGet(firstName + " " + lastName);
    for (let i = 0; i < compCores.length; i++) {
      let cmp = new Competition(compCores[i]);
      let des: DanceEvent[] = [];
      for (let j = 0; j < compCores[i].dancedEvents.length; j++) {
        try {
          des = des.concat(await EventParser.parse(compCores[i].linkCode, compCores[i].dancedEvents[j].division, compCores[i].dancedEvents[j].skill, http));

        } catch (err) {
          console.error("Error during parsing: " + compCores[i].name, "division: " + compCores[i].dancedEvents[j].division);
          console.error(err);
        }
      }
      cmp.DanceEvents = des.filter(e => e.hasDancer(dancer));
      comps.push(cmp);
    }

    return new Individual(firstName, lastName, comps);
  }
}
