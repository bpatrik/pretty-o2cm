import {SkillTypes} from '../../o2cm-parser/entities/DanceEvent';


export const Rules = {
  MaxPoints: {},
  Timeout: {}
};

Rules.MaxPoints[SkillTypes.Bronze] = 7;
Rules.MaxPoints[SkillTypes.Silver] = 7;
Rules.MaxPoints[SkillTypes.Gold] = 7;
Rules.MaxPoints[SkillTypes.Syllabus] = 7;
Rules.MaxPoints[SkillTypes.Novice] = 7;
Rules.MaxPoints[SkillTypes.PreChamp] = 7;

Rules.Timeout[SkillTypes.Newcomer] = 365 / 2 * 24 * 60 * 60 * 1000;
Rules.Timeout[SkillTypes.Bronze] = 365 * 24 * 60 * 60 * 1000;
