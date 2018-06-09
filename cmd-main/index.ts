import {HTTPLoader} from './HTTPLoader';
import {RegistrationParser} from '../common/o2cm-parser/RegistrationParser';
import {getSummary} from '../backend/model';
import {Dancer} from '../common/o2cm-parser/entities/Dancer';
import {ISummary} from '../frontend/app/services/ISummary';
import {Rules} from '../frontend/app/services/Rules';


const run = async () => {
  try {
    const events = await RegistrationParser.parse('mit', HTTPLoader);
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      for (let j = 0; j < event.placements.length; j++) {


        if (!Dancer.isTBA(event.placements[j].leader)) {
          const summary: ISummary = await getSummary(event.placements[j].leader);
          const ps = ISummary.findPointSummary(summary, event);
          if (ps.length === 0) {
            continue;
          }
          console.log(ps);
          const startTime = ps.map(v => v.startTime).sort()[0];
          const point = ps.map(v => v.points.overall).reverse()[0];
          const length = Rules.Timeout[event.pointSkill];
          const left = (startTime + length) - Date.now();
          console.log(event.placements[j].leader.name, point, left < 0 ? 'timeout' : '');
        }


        if (!Dancer.isTBA(event.placements[j].follower)) {
          const summary: ISummary = await getSummary(event.placements[j].follower);
          const ps = ISummary.findPointSummary(summary, event);
          if (ps.length === 0) {
            continue;
          }
          console.log(ps);
          const startTime = ps.map(v => v.startTime).sort()[0];
          const point = ps.map(v => v.points.overall).reverse()[0];
          const length = Rules.Timeout[event.pointSkill];
          const left = (startTime + length) - Date.now();
          console.log(event.placements[j].follower.name, point, left < 0 ? 'timeout' : '');
        }

      }
    }
  } catch (err) {
    console.log(err);
  }
};

run();
