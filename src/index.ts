import {IndividualParser} from "./o2cm-parser/IndividualParser";
import {SkillTypes} from "./o2cm-parser/entities/DanceEvent";
import {DancerRepository} from "./o2cm-parser/DancerRepository";
import {HTTPLoader} from "./o2cm-parser/HTTPLoader";


const run = async () => {
  try {
    let person = await IndividualParser.parse("Patrik", "Braun", HTTPLoader);
    let dancer = DancerRepository.Instance.createOrGet("Patrik Braun");

    let skills = person.Skills;
    for (let skillStr in SkillTypes) {
      let skill = parseInt(skillStr, 10);
      if (!skills.hasOwnProperty(skill)) {
        continue;
      }

      console.log("----------" + SkillTypes[skill] + "-------------");
      for (let i = 0; i < skills[skill].length; i++) {
        console.log(skills[skill][i].raw, skills[skill][i].getPlacement(dancer).placement,
          skills[skill][i].getPlacement(dancer).isFinal, skills[skill][i].CoupleCount);
      }
    }


  } catch (err) {
    console.log(err);
  }
};

run();
