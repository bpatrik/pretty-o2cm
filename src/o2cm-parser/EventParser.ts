import {HTTPLoader} from './HTTPLoader';
import * as cheerio from 'cheerio';
import {DanceEvent, DivisionTypes, SkillTypes} from './entities/DanceEvent';
import {EventNameParser} from './EventNameParser';
import {PlacementParser} from './DancerNameParser';
import {IHTTP} from './IndividualParser';


export class EventParser {

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

  private static skillToSelect(skill: SkillTypes) {
    const base = 'AND+%28uidheat%260xFF00%29%3E%3E8+%3D';
    switch (skill) {
      case SkillTypes.Newcomer:
        return base + '32';
      case SkillTypes.Bronze:
        return base + '40';
      case SkillTypes.Silver:
        return base + '48';
      case SkillTypes.Gold:
        return base + '56';
      case SkillTypes.Syllabus:
        return base + '63';
      case SkillTypes.Open:
        return base + '133';
      case SkillTypes.Novice:
        return base + '129';
      case SkillTypes.PreChamp:
        return base + '131';
      case SkillTypes.Championship:
        return base + '135';
      default:
        throw new Error('unsupported skill: ' + skill);
    }
  }

  private static generateBody(event: string, division: DivisionTypes, skill: SkillTypes) {
    return 'selDiv=' + this.divisionToSelect(division) + '&selAge=&selSkl=' + this.skillToSelect(skill) + '&selSty=&selEnt=&submit=OK&event=' + event;
  }

  private static parseEvents(page: string): DanceEvent[] {
    const $ = cheerio.load(page);
    const arr = $('tr', $('tbody').get(1)).toArray();
    let danceEvents = [];
    let roundCount = 0;
    for (let i = 0; i < arr.length; i++) {
      if ($('.h5b', arr[i]).length > 0) {
        danceEvents.push(EventNameParser.parse($('.h5b', arr[i]).get(0).firstChild.firstChild.data));
        continue;
      }

      if ($('.t2b', arr[i]).length > 0 && $('.t2b', arr[i]).get(0).firstChild.data.trim() !== '') {
        const placement = PlacementParser.parse($('.t2b', arr[i]).get(0).firstChild.data);
        placement.isFinal = true;
        placement.setEvent(danceEvents[danceEvents.length - 1]);
        continue;
      }

      if ($('.t2n', arr[i]).length > 0 && $('.t2n', arr[i]).get(0).firstChild.data.trim() !== '') {
        const placement = PlacementParser.parse($('.t2n', arr[i]).get(0).firstChild.data);
        placement.isFinal = false;
        placement.setEvent(danceEvents[danceEvents.length - 1]);
        continue;
      }


    }
    return danceEvents;
  }

  public static async parse(event: string, division: DivisionTypes, skill: SkillTypes, http: IHTTP): Promise<DanceEvent[]> {
    const page = await http.post('http://results.o2cm.com/event3.asp', this.generateBody(event, division, skill));
    return this.parseEvents(page);
  }
}
