import {IndividualParser} from '../o2cm-parser/IndividualParser';
import {DancerRepository} from '../o2cm-parser/DancerRepository';
import {HTTPLoader} from './HTTPLoader';
import {EventParser} from '../o2cm-parser/EventParser';
import {DivisionTypes, EventSkillTypes, StyleTypes} from '../o2cm-parser/entities/Types';
import {DanceEvent} from '../o2cm-parser/entities/DanceEvent';


const run = async () => {
  try {
    const dancer = DancerRepository.Instance.createOrGet('Patrik Braun');
    const p = await IndividualParser.parse(dancer, HTTPLoader, () => {
    }, [{name: '10-08-17 - Harvard Beginners 2017', date: 1507435200000, linkCode: 'hbi17'},
      {name: '02-11-18 - Terrier DanceSport Competition 2018', date: 1518325200000, linkCode: 'bub18'}]);

    const dances: DanceEvent[] = p.Styles[StyleTypes.Standard];

    const list = {};
    for (let i = 0; i < dances.length; i++) {
      const myPlacement = dances[i].getPlacement(dancer);

      for (let j = 0; j < dances[i].placements.length; j++) {
        const plm = dances[i].placements[j];
        const point = (myPlacement.placement - dances[i].placements[j].placement) / dances[i].placements.length;
        for (let k = 0; k < dances[i].placements[j].dancers.length; k++) {
          list[plm.dancers[k].name] = list[plm.dancers[k].name] || 0;
          list[plm.dancers[k].name] += point;
        }
      }
    }

    const sorted = Object.keys(list).map((key) => {
      return {name: key, score: list[key]};
    }).sort((a, b) => {
      return b.score - a.score;
    });

    console.log(sorted);

    /* const dancer = DancerRepository.Instance.createOrGet('Patrik Braun');
     const person = await IndividualParser.parse(dancer, HTTPLoader);

     const skills = person.Skills;
     for (const skillStr in PointSkillTypes) {
       if (!PointSkillTypes.hasOwnProperty(skillStr)) {
         continue;
       }
       const skill = parseInt(skillStr, 10);
       if (!skills.hasOwnProperty(skill)) {
         continue;
       }

       console.log('----------' + PointSkillTypes[skill] + '-------------');
       for (let i = 0; i < skills[skill].length; i++) {
         console.log(skills[skill][i].raw, skills[skill][i].getPlacement(dancer).placement,
           skills[skill][i].getPlacement(dancer).isFinal, skills[skill][i].CoupleCount);
       }
     }
 */

  } catch (err) {
    console.log(err);
  }
};

run();
