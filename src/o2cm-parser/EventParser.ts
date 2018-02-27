import {HTTPLoader} from '../cmd-main/HTTPLoader';
import * as cheerio from 'cheerio';
import {DanceEvent, ISkill} from './entities/DanceEvent';
import {EventNameParser} from './EventNameParser';
import {PlacementParser} from './DancerNameParser';
import {IHTTP} from './IndividualParser';
import {DivisionTypes, EventSkillTypes} from './entities/Types';


export class EventParser {

  private static skillToSelectBae = 'AND+%28uidheat%260xFF00%29%3E%3E8+%3D';

  private static divisionToSelect(division: DivisionTypes) {
    const base = 'AND+%28uidheat%260xFF000000%29%3E%3E24%3D+';
    switch (division) {
      case DivisionTypes.Amateur:
        return base + '64';
      case DivisionTypes.Combine:
        return base + '238';
      default:
        throw new Error('unsupported division: ' + division);
    }
  }


  private static skillToSelectID(skill: ISkill): number {
    switch (skill.type) {
      case EventSkillTypes.Newcomer:
        return 32;
      case EventSkillTypes.Bronze:
        return 40;
      case EventSkillTypes.Silver:
        return 48;
      case EventSkillTypes.Gold:
        return 56;
      case EventSkillTypes.Novice:
        return 129;
      case EventSkillTypes.PreChamp:
        return 131;
      case EventSkillTypes.Champ:
        return 135;
      case EventSkillTypes.Syllabus:
        return 63;
      case EventSkillTypes.Open:
        return 133;
      case EventSkillTypes.Beginner:
        return 44;
      case EventSkillTypes.Intermediate:
        return 52;
      case EventSkillTypes.Advanced:
        return 60;
      default:
        throw new Error('unsupported skill: ' + skill);
    }
  }

  private static generateBody(event: string, division: DivisionTypes, skillID: number) {
    return 'selDiv=' + this.divisionToSelect(division) +
      '&selAge=&selSkl=' + this.skillToSelectBae + skillID +
      '&selSty=&selEnt=&submit=OK&event=' + event;
  }

  private static parseEvents($: CheerioStatic): DanceEvent[] {
    const arr = $('tr', $('tbody').get(1)).toArray();
    const danceEvents: DanceEvent[] = [];
    let finalistParsed = false;
    let nonFinalistParsed = false;
    for (let i = 0; i < arr.length; i++) {
      if ($('.h5b', arr[i]).length > 0) {
        danceEvents.push(EventNameParser.parse($('.h5b', arr[i]).get(0).firstChild.firstChild.data));
        finalistParsed = false;
        nonFinalistParsed = false;
        continue;
      }

      if ($('.t2b', arr[i]).length > 0 && $('.t2b', arr[i]).get(0).firstChild.data.trim() !== '') {
        const placement = PlacementParser.parse($('.t2b', arr[i]).get(0).firstChild.data);
        placement.isFinal = true;
        placement.setEvent(danceEvents[danceEvents.length - 1]);
        finalistParsed = true;
        continue;
      }

      if ($(':contains(\'----\')', arr[i]).length > 0) {
        // this event is ill rendered, the first round contains non finalists too, probably teo rounds
        if (danceEvents[danceEvents.length - 1].Rounds === 0 &&
          finalistParsed === true &&
          nonFinalistParsed === true) {
          danceEvents[danceEvents.length - 1].Rounds++;
        }
        danceEvents[danceEvents.length - 1].Rounds++;
        continue;
      }

      if ($('.t2n', arr[i]).length > 0 && $('.t2n', arr[i]).get(0).firstChild.data.trim() !== '') {
        const placement = PlacementParser.parse($('.t2n', arr[i]).get(0).firstChild.data);
        placement.isFinal = false;
        nonFinalistParsed = true;
        placement.setEvent(danceEvents[danceEvents.length - 1]);
        continue;
      }


    }
    return danceEvents;
  }

  private static parseSkillTypes($: CheerioStatic, skill: ISkill): number[] {
    const arr = $('#selSkl option').toArray().map((o) => {
      return {
        key: parseInt(o.attribs['value'].substring(o.attribs['value'].lastIndexOf('=') + 1), 10),
        value: o.firstChild.data
      };
    }).filter(v => v.value.indexOf(skill.str) !== -1 && v.key !== this.skillToSelectID(skill));
    return arr.map(v => v.key);
  }

  public static getUrl(event: string) {
    return 'http://results.o2cm.com/event3.asp?event=' + event;
  }

  public static async parse(event: string, division: DivisionTypes, skill: ISkill, http: IHTTP): Promise<DanceEvent[]> {
    const page = await http.post('http://results.o2cm.com/event3.asp', this.generateBody(event, division, this.skillToSelectID(skill)));
    const $ = cheerio.load(page);
    let events = this.parseEvents($);
    const extraST = this.parseSkillTypes($, skill);
    for (let i = 0; i < extraST.length; i++) {
      const p = await http.post('http://results.o2cm.com/event3.asp', this.generateBody(event, division, extraST[i]));
      events = events.concat(this.parseEvents(cheerio.load(p)));
    }
    return events;
  }
}
