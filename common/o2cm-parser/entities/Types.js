"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DivisionTypes;
(function (DivisionTypes) {
    DivisionTypes[DivisionTypes["Amateur"] = 0] = "Amateur";
    DivisionTypes[DivisionTypes["Combine"] = 1] = "Combine";
})(DivisionTypes = exports.DivisionTypes || (exports.DivisionTypes = {}));
var PointSkillTypes;
(function (PointSkillTypes) {
    PointSkillTypes[PointSkillTypes["Newcomer"] = 0] = "Newcomer";
    PointSkillTypes[PointSkillTypes["Bronze"] = 1] = "Bronze";
    PointSkillTypes[PointSkillTypes["Silver"] = 2] = "Silver";
    PointSkillTypes[PointSkillTypes["Gold"] = 3] = "Gold";
    PointSkillTypes[PointSkillTypes["Novice"] = 4] = "Novice";
    PointSkillTypes[PointSkillTypes["PreChamp"] = 5] = "PreChamp";
    PointSkillTypes[PointSkillTypes["Champ"] = 6] = "Champ";
})(PointSkillTypes = exports.PointSkillTypes || (exports.PointSkillTypes = {}));
var EventSkillTypes;
(function (EventSkillTypes) {
    EventSkillTypes[EventSkillTypes["Newcomer"] = 0] = "Newcomer";
    EventSkillTypes[EventSkillTypes["Bronze"] = 1] = "Bronze";
    EventSkillTypes[EventSkillTypes["Silver"] = 2] = "Silver";
    EventSkillTypes[EventSkillTypes["Gold"] = 3] = "Gold";
    EventSkillTypes[EventSkillTypes["Novice"] = 4] = "Novice";
    EventSkillTypes[EventSkillTypes["PreChamp"] = 5] = "PreChamp";
    EventSkillTypes[EventSkillTypes["Champ"] = 6] = "Champ";
    EventSkillTypes[EventSkillTypes["Beginner"] = 7] = "Beginner";
    EventSkillTypes[EventSkillTypes["Intermediate"] = 8] = "Intermediate";
    EventSkillTypes[EventSkillTypes["Advanced"] = 9] = "Advanced";
    EventSkillTypes[EventSkillTypes["Syllabus"] = 10] = "Syllabus";
    EventSkillTypes[EventSkillTypes["Open"] = 11] = "Open";
})(EventSkillTypes = exports.EventSkillTypes || (exports.EventSkillTypes = {}));
(function (EventSkillTypes) {
    EventSkillTypes.toPointSkillType = function (skill) {
        switch (skill) {
            case EventSkillTypes.Beginner:
                return PointSkillTypes.Bronze;
            case EventSkillTypes.Intermediate:
                return PointSkillTypes.Silver;
            case EventSkillTypes.Advanced:
                return PointSkillTypes.Gold;
            case EventSkillTypes.Syllabus:
                return PointSkillTypes.Bronze;
            case EventSkillTypes.Open:
                return PointSkillTypes.Novice;
        }
        return skill;
    };
})(EventSkillTypes = exports.EventSkillTypes || (exports.EventSkillTypes = {}));
var AgeTypes;
(function (AgeTypes) {
    AgeTypes[AgeTypes["Adult"] = 0] = "Adult";
})(AgeTypes = exports.AgeTypes || (exports.AgeTypes = {}));
var StyleTypes;
(function (StyleTypes) {
    StyleTypes[StyleTypes["Standard"] = 1] = "Standard";
    StyleTypes[StyleTypes["Smooth"] = 2] = "Smooth";
    StyleTypes[StyleTypes["Latin"] = 4] = "Latin";
    StyleTypes[StyleTypes["Rhythm"] = 8] = "Rhythm";
})(StyleTypes = exports.StyleTypes || (exports.StyleTypes = {}));
var DanceTypes;
(function (DanceTypes) {
    DanceTypes[DanceTypes["Tango"] = 0] = "Tango";
    DanceTypes[DanceTypes["VWaltz"] = 1] = "VWaltz";
    DanceTypes[DanceTypes["Foxtrot"] = 2] = "Foxtrot";
    DanceTypes[DanceTypes["Waltz"] = 3] = "Waltz";
    DanceTypes[DanceTypes["QuickStep"] = 4] = "QuickStep";
    DanceTypes[DanceTypes["Jive"] = 5] = "Jive";
    DanceTypes[DanceTypes["ChaCha"] = 6] = "ChaCha";
    DanceTypes[DanceTypes["Rumba"] = 7] = "Rumba";
    DanceTypes[DanceTypes["Swing"] = 8] = "Swing";
    DanceTypes[DanceTypes["Pasodoble"] = 9] = "Pasodoble";
    DanceTypes[DanceTypes["Bolero"] = 10] = "Bolero";
    DanceTypes[DanceTypes["Samba"] = 11] = "Samba";
    DanceTypes[DanceTypes["Mambo"] = 12] = "Mambo";
})(DanceTypes = exports.DanceTypes || (exports.DanceTypes = {}));
(function (DanceTypes) {
    DanceTypes.LetterType = {
        T: DanceTypes.Tango,
        V: DanceTypes.VWaltz,
        F: DanceTypes.Foxtrot,
        W: DanceTypes.Waltz,
        Q: DanceTypes.QuickStep,
        J: DanceTypes.Jive,
        C: DanceTypes.ChaCha,
        R: DanceTypes.Rumba,
        B: DanceTypes.Bolero,
        P: DanceTypes.Pasodoble,
        S: DanceTypes.Swing,
        M: DanceTypes.Mambo,
    };
    var tmp = JSON.parse(JSON.stringify(DanceTypes.LetterType));
    DanceTypes.toLetter = {};
    Object.keys(tmp).forEach(function (v) { return DanceTypes.toLetter[tmp[v]] = v; });
    DanceTypes.toLetter[DanceTypes.Samba] = 'S';
    function getStyleForOne(dance) {
        if (dance === DanceTypes.Jive || dance === DanceTypes.ChaCha ||
            dance === DanceTypes.Rumba || dance === DanceTypes.Swing
            || dance === DanceTypes.Pasodoble || dance === DanceTypes.Bolero
            || dance === DanceTypes.Samba || dance === DanceTypes.Mambo) {
            // noinspection TsLint
            return (StyleTypes.Latin | StyleTypes.Rhythm);
        }
        if (dance === DanceTypes.Foxtrot || dance === DanceTypes.Waltz ||
            dance === DanceTypes.QuickStep || dance === DanceTypes.Tango || dance === DanceTypes.VWaltz) {
            // noinspection TsLint
            return (StyleTypes.Smooth | StyleTypes.Standard);
        }
        return null;
    }
    DanceTypes.getStyleForOne = getStyleForOne;
    function getStyle(dances) {
        if (!dances) {
            return null;
        }
        var style = null;
        for (var i = 0; i < dances.length; i++) {
            if (style == null) {
                style = DanceTypes.getStyleForOne(dances[i]);
            }
            else if (style !== DanceTypes.getStyleForOne(dances[i])) {
                return null;
            }
        }
        return style;
    }
    DanceTypes.getStyle = getStyle;
})(DanceTypes = exports.DanceTypes || (exports.DanceTypes = {}));
//# sourceMappingURL=Types.js.map