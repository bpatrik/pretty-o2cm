import {IHTTP} from './IndividualParser';
import {EventNameParser} from './EventNameParser';
import {PlacementParser} from './DancerNameParser';
import {DanceEvent} from './entities/DanceEvent';
import * as $ from 'jquery';

export class RegistrationParser {


  private static parseEvents($page: JQuery): DanceEvent[] {

    const danceEvents: DanceEvent[] = [];
    let finalistParsed = false;
    let nonFinalistParsed = false;
    $page.find('tbody').eq(1).find('tr').each((index, item) => {
      const $tr = $(item);
      if ($tr.find('.h5b').length > 0) {
        danceEvents.push(EventNameParser.parse($tr.find('.h5b').first().html(), null));
        finalistParsed = false;
        nonFinalistParsed = false;
        return;
      }
      if ($tr.find('.h5n').length > 0 && $tr.find('.h5n').text().trim() !== '') {

        const placement = PlacementParser.parse($tr.find('.h5n').text().trim());
        placement.isFinal = true;
        placement.setEvent(danceEvents[danceEvents.length - 1]);
        finalistParsed = true;
      }

    });
    return danceEvents;
  }

  private static generateBody(event: string) {
    // return 'selDiv=&selAge=00&selSkl=20&selSty=+AND+%28uidheat%260x70%29%3D0x10&submit=OK&selEnt=&event=mit';
    return 'selDiv=&selAge=00&selSkl=00&selSty=&selEnt=&submit=OK&event=' + event;
  }


  public static async parse(eventId: string, http: IHTTP): Promise<DanceEvent[]> {
    const page = await http.post('http://entries.o2cm.com/default.asp', this.generateBody('mit'));
    const $page = $($.parseHTML(page));

    return this.parseEvents($page);
  }
}
