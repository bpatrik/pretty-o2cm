"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("./entities/Types");
var DanceEvent_1 = require("./entities/DanceEvent");
var Utils_1 = require("../../frontend/Utils");
var EventNameParser = /** @class */ (function () {
    function EventNameParser() {
    }
    EventNameParser.parseAge = function (name) {
        var ages = Utils_1.Utils.enumToArray(Types_1.AgeTypes);
        for (var i = 0; i < ages.length; i++) {
            if (name.indexOf(ages[i].value) !== -1) {
                return ages[i].key;
            }
        }
        return null;
    };
    EventNameParser.parseSkill = function (name) {
        var list = Utils_1.Utils.enumToArray(Types_1.EventSkillTypes);
        list.push({ key: Types_1.EventSkillTypes.Newcomer, value: 'Pre-Bronze' });
        list.push({ key: Types_1.EventSkillTypes.PreChamp, value: 'Pre-Champ' });
        list.push({ key: Types_1.EventSkillTypes.Champ, value: 'Championship' });
        list.sort(); // order to long to short
        for (var i = 0; i < list.length; i++) {
            if (name.indexOf(' ' + list[i].value) !== -1) {
                var startIndex = name.indexOf(list[i].value);
                var rawStr = name.substring(name.lastIndexOf(' ', startIndex) + 1, name.indexOf(' ', startIndex));
                return { type: list[i].key, str: rawStr };
            }
        }
        console.warn('can\'t parse skill: ' + name);
        return null;
    };
    EventNameParser.parseDivision = function (name) {
        var list = Utils_1.Utils.enumToArray(Types_1.DivisionTypes);
        for (var i = 0; i < list.length; i++) {
            if (name.indexOf(list[i].value) !== -1) {
                return list[i].key;
            }
        }
        return null;
    };
    EventNameParser.parseStyle = function (name, dances) {
        var list = Utils_1.Utils.enumToArray(Types_1.StyleTypes);
        for (var i = 0; i < list.length; i++) {
            if (name.indexOf(list[i].value) !== -1) {
                return list[i].key;
            }
        }
        if (name.indexOf('Am.') !== -1) {
            // noinspection TsLint
            if ((Types_1.DanceTypes.getStyle(dances) & Types_1.StyleTypes.Rhythm) !== 0) {
                return Types_1.StyleTypes.Rhythm;
            }
            // noinspection TsLint
            if ((Types_1.DanceTypes.getStyle(dances) & Types_1.StyleTypes.Smooth) !== 0) {
                return Types_1.StyleTypes.Smooth;
            }
        }
        // if not Am., then international by default
        // noinspection TsLint
        if ((Types_1.DanceTypes.getStyle(dances) & Types_1.StyleTypes.Latin) !== 0) {
            return Types_1.StyleTypes.Latin;
        }
        // noinspection TsLint
        if ((Types_1.DanceTypes.getStyle(dances) & Types_1.StyleTypes.Standard) !== 0) {
            return Types_1.StyleTypes.Standard;
        }
        return null;
    };
    EventNameParser.adjustDances = function (dances, style) {
        if (!dances) {
            return dances;
        }
        // TODO: make it more  abstract
        for (var i = 0; i < dances.length; i++) {
            if (dances[i] === Types_1.DanceTypes.Swing && style === Types_1.StyleTypes.Latin) {
                dances[i] = Types_1.DanceTypes.Samba;
            }
        }
        return dances;
    };
    EventNameParser.guessDances = function (name) {
        if (name.lastIndexOf('(') !== -1 && name.lastIndexOf(')') !== -1) {
            var list = [];
            var letters = name.substring(name.lastIndexOf('(') + 1, name.lastIndexOf(')'));
            for (var i = 0; i < letters.length; i++) {
                list.push(Types_1.DanceTypes.LetterType[letters.charAt(i)]);
            }
            return list;
        }
        return null;
    };
    EventNameParser.parse = function (name, heatid) {
        if (name.toLocaleLowerCase().indexOf('fun') !== -1 && name.toLocaleLowerCase().indexOf('polka') !== -1) {
            return null;
        }
        var division = this.parseDivision(name) || Types_1.DivisionTypes.Amateur;
        var age = this.parseAge(name);
        var skill = this.parseSkill(name);
        var dances = this.guessDances(name);
        var style = this.parseStyle(name, dances);
        dances = this.adjustDances(dances, style);
        return new DanceEvent_1.DanceEvent(name, heatid, division, age, skill, style, dances);
    };
    return EventNameParser;
}());
exports.EventNameParser = EventNameParser;
//# sourceMappingURL=EventNameParser.js.map