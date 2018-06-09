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
var EventNameParser_1 = require("./EventNameParser");
var EventParser_1 = require("./EventParser");
var Individual_1 = require("./entities/Individual");
var DancerRepository_1 = require("./DancerRepository");
var Competition_1 = require("./entities/Competition");
var $ = require("jquery");
var CompetitionCore = /** @class */ (function () {
    function CompetitionCore(rawName) {
        this.dancedEvents = [];
        this.rawName = rawName;
    }
    CompetitionCore.prototype.addEvent = function (event) {
        for (var i = 0; i < this.dancedEvents.length; i++) {
            if (this.dancedEvents[i].division === event.division && this.dancedEvents[i].eventSkill.str === event.eventSkill.str) {
                return;
            }
        }
        this.dancedEvents.push(event);
    };
    CompetitionCore.prototype.equalsIn = function (filters) {
        for (var i = 0; i < filters.length; i++) {
            if (this.rawName === filters[i].rawName && this.date === filters[i].date && this.linkCode === filters[i].linkCode) {
                return true;
            }
        }
        return false;
    };
    return CompetitionCore;
}());
exports.CompetitionCore = CompetitionCore;
var IndividualParser = /** @class */ (function () {
    function IndividualParser() {
    }
    /**
     * It parses the summary page of a dancer. Lists the competitions with its linkCode and all the division+skill pairs for that comp.
     * @param {string} page
     * @returns {CompetitionCore[]}
     */
    IndividualParser.parseCompetitions = function (page) {
        var $page = $($.parseHTML(page));
        var competitions = [];
        $page.find('td.t1n').each(function (index, item) {
            var $t1n = $(item);
            try {
                // its a competition
                if ($t1n.find('b').length > 0) {
                    var eventName = $t1n.find('b').first().html();
                    var cmp = new CompetitionCore(eventName);
                    var matched = eventName.match(/^[0-9]+(-[0-9]+)+/);
                    if (matched !== null) {
                        var nums = matched[0].split(('-'));
                        cmp.date = (new Date((parseInt(nums[2], 10) < 60 ? parseInt(nums[2], 10) + 2000 : parseInt(nums[2], 10)), parseInt(nums[0], 10) - 1, parseInt(nums[1], 10))).getTime();
                        cmp.name = eventName.replace(matched[0], '').trim();
                        if (cmp.name.startsWith('-')) {
                            cmp.name = cmp.name.replace('-', '').trim();
                        }
                    }
                    competitions.push(cmp);
                    return;
                }
                // its an event. we collect only the event/comp link codes. We collect only unique division+skill pairs
                if ($t1n.find('a').length > 0 && competitions.length > 0) {
                    var rawName = $t1n.find('a').first().html();
                    var href = $t1n.find('a').attr('href');
                    var eventLink = href.substring(href.indexOf('event=') + 6);
                    eventLink = eventLink.substring(0, eventLink.indexOf('&'));
                    var heatid = href.substring(href.indexOf('heatid=') + 7);
                    if (heatid.indexOf('&') !== -1) {
                        heatid = heatid.substring(0, heatid.indexOf('&'));
                    }
                    var event_1 = EventNameParser_1.EventNameParser.parse(rawName, heatid);
                    if (event_1 === null) {
                        return;
                    }
                    var cmp = competitions[competitions.length - 1];
                    cmp.addEvent(event_1);
                    cmp.linkCode = eventLink;
                }
            }
            catch (e) {
                console.error(e);
            }
        });
        return competitions;
    };
    /**
     * Loads the vent details by parsing the detailed competition page using the event linkCode and division+skill pairs
     * @param {DancerName} name
     * @param {CompetitionCore[]} compCores
     * @param {IHTTP} http
     * @param {(loading: ILoading) => void} progress
     * @returns {Promise<Competition[]>}
     */
    IndividualParser.loadEventDetails = function (name, compCores, http, progress) {
        return __awaiter(this, void 0, void 0, function () {
            var comps, dancer, i, cmp, des, j, _a, _b, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        comps = [];
                        dancer = DancerRepository_1.DancerRepository.Instance.createOrGet(name.firstName + ' ' + name.lastName);
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < compCores.length)) return [3 /*break*/, 9];
                        cmp = new Competition_1.Competition(compCores[i]);
                        progress({
                            url: EventParser_1.EventParser.getUrl(cmp.linkCode),
                            current: i + 1,
                            maximum: compCores.length,
                            details: cmp.rawName
                        });
                        des = [];
                        j = 0;
                        _c.label = 2;
                    case 2:
                        if (!(j < compCores[i].dancedEvents.length)) return [3 /*break*/, 7];
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 5, , 6]);
                        _b = (_a = des).concat;
                        return [4 /*yield*/, EventParser_1.EventParser.parse(compCores[i].linkCode, compCores[i].dancedEvents[j].division, compCores[i].dancedEvents[j].eventSkill, http)];
                    case 4:
                        des = _b.apply(_a, [_c.sent()]);
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _c.sent();
                        console.error('Error during parsing: ' + compCores[i].name, 'division: ' + compCores[i].dancedEvents[j].division);
                        console.error(err_1);
                        return [3 /*break*/, 6];
                    case 6:
                        j++;
                        return [3 /*break*/, 2];
                    case 7:
                        cmp.DanceEvents = des.filter(function (e) { return e.hasDancer(dancer) === true; });
                        comps.push(cmp);
                        _c.label = 8;
                    case 8:
                        i++;
                        return [3 /*break*/, 1];
                    case 9: return [2 /*return*/, comps];
                }
            });
        });
    };
    IndividualParser.generateRndKey = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4();
    };
    IndividualParser.parse = function (name, http, progress, parsedComps) {
        if (progress === void 0) { progress = function () {
        }; }
        if (parsedComps === void 0) { parsedComps = []; }
        return __awaiter(this, void 0, void 0, function () {
            var url, page, compCores, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = 'http://results.o2cm.com/individual.asp?szLast=' + name.lastName +
                            '&szFirst=' + name.firstName + '&rnd=' + this.generateRndKey();
                        progress({
                            url: url,
                            current: 0
                        });
                        return [4 /*yield*/, http.post(url, '')];
                    case 1:
                        page = _c.sent();
                        compCores = this.parseCompetitions(page).filter(function (c) { return !c.equalsIn(parsedComps); });
                        _a = Individual_1.Individual.bind;
                        _b = [void 0, name.firstName, name.lastName];
                        return [4 /*yield*/, this.loadEventDetails(name, compCores, http, progress)];
                    case 2: return [2 /*return*/, new (_a.apply(Individual_1.Individual, _b.concat([_c.sent()])))()];
                }
            });
        });
    };
    return IndividualParser;
}());
exports.IndividualParser = IndividualParser;
//# sourceMappingURL=IndividualParser.js.map
