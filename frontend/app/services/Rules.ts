import {PointSkillTypes} from '../../../common/o2cm-parser/entities/Types';


export const Rules: {
  MaxPoints: { [key: number]: number };
  Timeout: { [key: number]: number };
  NoPointExceptions: { name: string, reason: string }[];
} = {
  MaxPoints: {},
  Timeout: {},
  NoPointExceptions: []
};

Rules.MaxPoints[PointSkillTypes.Bronze] = 7;
Rules.MaxPoints[PointSkillTypes.Silver] = 7;
Rules.MaxPoints[PointSkillTypes.Gold] = 7;
Rules.MaxPoints[PointSkillTypes.Novice] = 7;
Rules.MaxPoints[PointSkillTypes.PreChamp] = 7;

Rules.Timeout[PointSkillTypes.Newcomer] = 365 / 2 * 24 * 60 * 60 * 1000;
Rules.Timeout[PointSkillTypes.Bronze] = 365 * 24 * 60 * 60 * 1000;

Rules.NoPointExceptions.push({
  name: 'Harvard Beginners',
  reason: 'No professional judges'
});
