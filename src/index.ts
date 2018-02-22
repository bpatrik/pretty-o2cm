import {IndividualParser} from './o2cm-parser/IndividualParser';
import {DivisionTypes, EventSkillTypes, PointSkillTypes} from './o2cm-parser/entities/Types';
import {DancerRepository} from './o2cm-parser/DancerRepository';
import {HTTPLoader} from './o2cm-parser/HTTPLoader';
import {EventParser} from './o2cm-parser/EventParser';


const run = async () => {
  try {

    let p = await EventParser.parse('ned16', DivisionTypes.Amateur, EventSkillTypes.Champ, HTTPLoader);

    console.log(p);
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
