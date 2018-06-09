"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
var EventNameParser_1 = require("./EventNameParser");
var DancerNameParser_1 = require("./DancerNameParser");
var Types_1 = require("./entities/Types");
var EventParser = /** @class */ (function () {
    function EventParser() {
    }
    EventParser.divisionToSelect = function (division) {
        var base = 'AND+%28uidheat%260xFF000000%29%3E%3E24%3D+';
        switch (division) {
            case Types_1.DivisionTypes.Amateur:
                return base + '64';
            case Types_1.DivisionTypes.Combine:
                return base + '238';
            default:
                throw new Error('unsupported division: ' + division);
        }
    };
    EventParser.skillToSelectID = function (skill) {
        switch (skill.type) {
            case Types_1.EventSkillTypes.Newcomer:
                return 32;
            case Types_1.EventSkillTypes.Bronze:
                return 40;
            case Types_1.EventSkillTypes.Silver:
                return 48;
            case Types_1.EventSkillTypes.Gold:
                return 56;
            case Types_1.EventSkillTypes.Novice:
                return 129;
            case Types_1.EventSkillTypes.PreChamp:
                return 131;
            case Types_1.EventSkillTypes.Champ:
                return 135;
            case Types_1.EventSkillTypes.Syllabus:
                return 63;
            case Types_1.EventSkillTypes.Open:
                return 133;
            case Types_1.EventSkillTypes.Beginner:
                return 44;
            case Types_1.EventSkillTypes.Intermediate:
                return 52;
            case Types_1.EventSkillTypes.Advanced:
                return 60;
            default:
                throw new Error('unsupported skill: ' + skill);
        }
    };
    EventParser.generateBody = function (event, division, skillID) {
        return 'selDiv=' + this.divisionToSelect(division) +
            '&selAge=&selSkl=' + this.skillToSelectBae + skillID +
            '&selSty=&selEnt=&submit=OK&event=' + event;
    };
    EventParser.parseEvents = function ($page) {
        var danceEvents = [];
        var finalistParsed = false;
        var nonFinalistParsed = false;
        $page.find('tbody').find('tr').each(function (index, item) {
            var $tr = $(item);
            if ($tr.find('.h5b').toArray().length > 0) {
                var href = $tr.find('a').attr('href');
                var heatid = href.substring(href.indexOf('heatid=') + 7);
                if (heatid.indexOf('&') !== -1) {
                    heatid = heatid.substring(0, heatid.indexOf('&'));
                }
                danceEvents.push(EventNameParser_1.EventNameParser.parse($tr.find('.h5b').first().first().html(), heatid));
                finalistParsed = false;
                nonFinalistParsed = false;
                return;
            }
            if ($tr.find('.t2b').length > 0 && $tr.find('.t2b').first().html().trim() !== '') {
                var placement = DancerNameParser_1.PlacementParser.parse($tr.find('.t2b').html()
                    .replace(new RegExp('&amp;', 'g'), '&')
                    .replace(new RegExp('<b>', 'g'), '')
                    .replace(new RegExp('</b>', 'g'), ''));
                placement.isFinal = true;
                placement.setEvent(danceEvents[danceEvents.length - 1]);
                finalistParsed = true;
                return;
            }
            if ($tr.find(':contains(\'----\')').length > 0) {
                // this event is ill rendered, the first round contains non finalists too, probably teo rounds
                if (danceEvents[danceEvents.length - 1].rounds === 0 &&
                    finalistParsed === true &&
                    nonFinalistParsed === true) {
                    danceEvents[danceEvents.length - 1].rounds++;
                }
                danceEvents[danceEvents.length - 1].rounds++;
                return;
            }
            if ($tr.find('.t2n').length > 0 && $tr.find('.t2n').first().html().trim() !== '') {
                var placement = DancerNameParser_1.PlacementParser.parse($tr.find('.t2n').html()
                    .replace(new RegExp('&amp;', 'g'), '&')
                    .replace(new RegExp('<b>', 'g'), '')
                    .replace(new RegExp('</b>', 'g'), ''));
                placement.isFinal = false;
                nonFinalistParsed = true;
                placement.setEvent(danceEvents[danceEvents.length - 1]);
                return;
            }
        });
        return danceEvents;
    };
    EventParser.parseSkillTypes = function ($page, skill) {
        var _this = this;
        var arr = $page.find('#selSkl option').toArray().map(function (item) {
            var $o = $(item);
            return {
                key: parseInt($o.attr('value').substring($o.attr('value').lastIndexOf('=') + 1), 10),
                value: $o.first().html()
            };
        }).filter(function (v) { return v.value.indexOf(skill.str) !== -1 && v.key !== _this.skillToSelectID(skill); });
        return arr.map(function (v) { return v.key; });
    };
    EventParser.getUrl = function (event) {
        return 'http://results.o2cm.com/event3.asp?event=' + event;
    };
    EventParser.parse = function (event, division, skill, http) {
        return __awaiter(this, void 0, void 0, function () {
            var page, $page, events, extraST, i, p;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, http.post('http://results.o2cm.com/event3.asp', this.generateBody(event, division, this.skillToSelectID(skill)))];
                    case 1:
                        page = _a.sent();
                        $page = $($.parseHTML(page));
                        events = this.parseEvents($page);
                        extraST = this.parseSkillTypes($page, skill);
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < extraST.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, http.post('http://results.o2cm.com/event3.asp', this.generateBody(event, division, extraST[i]))];
                    case 3:
                        p = _a.sent();
                        events = events.concat(this.parseEvents($($.parseHTML(p))));
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, events];
                }
            });
        });
    };
    EventParser.skillToSelectBae = 'AND+%28uidheat%260xFF00%29%3E%3E8+%3D';
    return EventParser;
}());
exports.EventParser = EventParser;
//# sourceMappingURL=EventParser.js.map
