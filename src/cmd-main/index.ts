import {IndividualParser} from '../o2cm-parser/IndividualParser';
import {DancerRepository} from '../o2cm-parser/DancerRepository';
import {HTTPLoader} from './HTTPLoader';
import {EventParser} from '../o2cm-parser/EventParser';
import {DivisionTypes, EventSkillTypes} from '../o2cm-parser/entities/Types';


const run = async () => {
  try {
    /* const dancer = DancerRepository.Instance.createOrGet('Ben Moss');
     const p = await IndividualParser.parse(dancer, HTTPLoader);
 */

    await EventParser.parse('bad10',
      DivisionTypes.Amateur,
      {type: EventSkillTypes.PreChamp, str: 'Pre-Champ'},
      HTTPLoader);
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
