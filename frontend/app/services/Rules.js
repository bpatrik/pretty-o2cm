"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("../../../common/o2cm-parser/entities/Types");
exports.Rules = {
    MaxPoints: {},
    Timeout: {},
    NoPointExceptions: []
};
exports.Rules.MaxPoints[Types_1.PointSkillTypes.Bronze] = 7;
exports.Rules.MaxPoints[Types_1.PointSkillTypes.Silver] = 7;
exports.Rules.MaxPoints[Types_1.PointSkillTypes.Gold] = 7;
exports.Rules.MaxPoints[Types_1.PointSkillTypes.Novice] = 7;
exports.Rules.MaxPoints[Types_1.PointSkillTypes.PreChamp] = 7;
exports.Rules.Timeout[Types_1.PointSkillTypes.Newcomer] = 365 / 2 * 24 * 60 * 60 * 1000;
exports.Rules.Timeout[Types_1.PointSkillTypes.Bronze] = 365 * 24 * 60 * 60 * 1000;
exports.Rules.NoPointExceptions.push({
    name: 'Harvard Beginners',
    reason: 'No professional judges'
});
//# sourceMappingURL=Rules.js.map