import * as $ from 'jquery';
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

  private static parseEvents($page: JQuery): DanceEvent[] {
    const danceEvents: DanceEvent[] = [];
    let finalistParsed = false;
    let nonFinalistParsed = false;
    $page.find('tbody').eq(1).find('tr').each((index, item) => {
      const $tr = $(item);
      if ($tr.find('.h5b').length > 0) {
        const href = $tr.find('a').attr('href');
        let heatid = href.substring(href.indexOf('heatid=') + 7);
        if (heatid.indexOf('&') !== -1) {
          heatid = heatid.substring(0, heatid.indexOf('&'));
        }
        danceEvents.push(EventNameParser.parse($tr.find('.h5b').first().first().html(), heatid));
        finalistParsed = false;
        nonFinalistParsed = false;
        return;
      }

      if ($tr.find('.t2b').length > 0 && $tr.find('.t2b').first().html().toString().trim() !== '') {

        const placement = PlacementParser.parse($tr.find('.t2b').html()
          .replace(new RegExp('&amp;', 'g'), '&')
          .replace(new RegExp('<b>', 'g'), '')
          .replace(new RegExp('</b>', 'g'), ''));
        placement.isFinal = true;
        placement.setEvent(danceEvents[danceEvents.length - 1]);
        finalistParsed = true;
        return;
      }

      if ($tr.find(':contains(\'----\')').length > 0) {
        // this event is ill rendered, the first round contains non finalists too, probably teo rounds
        if (danceEvents[danceEvents.length - 1].rounds === 0 &&
          finalistParsed === true &&
          nonFinalistParsed === true) {
          danceEvents[danceEvents.length - 1].rounds++;
        }
        danceEvents[danceEvents.length - 1].rounds++;
        return;
      }

      if ($tr.find('.t2n').length > 0 && $tr.find('.t2n').html().trim().replace('&nbsp;', '') !== '') {
        const placement = PlacementParser.parse($tr.find('.t2n').html()
          .replace(new RegExp('&amp;', 'g'), '&')
          .replace(new RegExp('<b>', 'g'), '')
          .replace(new RegExp('</b>', 'g'), ''));
        placement.isFinal = false;
        nonFinalistParsed = true;
        placement.setEvent(danceEvents[danceEvents.length - 1]);
        return;
      }
    });
    return danceEvents;
  }

  private static parseSkillTypes($page: JQuery, skill: ISkill): number[] {
    const arr = $page.find('#selSkl option').toArray().map((item) => {
      const $o = $(item);
      return {
        key: parseInt($o.attr('value').substring($o.attr('value').lastIndexOf('=') + 1), 10),
        value: $o.first().html()
      };
    }).filter(v => v.value.indexOf(skill.str) !== -1 && v.key !== this.skillToSelectID(skill));
    return arr.map(v => v.key);
  }

  public static getUrl(event: string) {
    return 'http://results.o2cm.com/event3.asp?event=' + event;
  }

  public static async parse(event: string,
                            division: DivisionTypes,
                            skill: ISkill,
                            http: IHTTP): Promise<DanceEvent[]> {
    const page = await http.post('http://results.o2cm.com/event3.asp', this.generateBody(event, division, this.skillToSelectID(skill)));
    const $page = $($.parseHTML(page));
    let events = this.parseEvents($page);
    const extraST = this.parseSkillTypes($page, skill);
    for (let i = 0; i < extraST.length; i++) {
      const p = await http.post('http://results.o2cm.com/event3.asp', this.generateBody(event, division, extraST[i]));
      events = events.concat(this.parseEvents($($.parseHTML(p))));
    }
    return events;
  }
}
