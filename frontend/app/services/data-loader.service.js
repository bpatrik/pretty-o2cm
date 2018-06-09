"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Types_1 = require("../../../common/o2cm-parser/entities/Types");
var Rules_1 = require("./Rules");
var DataParserService = /** @class */ (function () {
    function DataParserService() {
    }
    DataParserService.prototype.mergeDate = function (base, extend) {
        base.competitions = base.competitions.concat(extend.competitions);
        base.competitions = base.competitions.sort(function (a, b) { return b.date - a.date; });
        for (var style in extend.summary) {
            if (!extend.summary.hasOwnProperty(style)) {
                continue;
            }
            if (!base.summary.hasOwnProperty(style)) {
                base.summary[style] = extend.summary[style];
                continue;
            }
            var eDances = extend.summary[style].dances;
            var bDances = base.summary[style].dances;
            for (var i = 0; i < eDances.length; i++) {
                var foundIndex = null;
                for (var j = 0; j < bDances.length; j++) {
                    if (bDances[j].dance === eDances[i].dance) {
                        foundIndex = j;
                        break;
                    }
                }
                if (foundIndex === null) {
                    bDances.push(eDances[i]);
                    continue;
                }
                var mergePoints = function (b, e) {
                    b.overall += e.overall;
                    for (var k = 0; k < b.details.length; k++) {
                        for (var l = 0; l < e.details.length; l++) {
                            if (b.details[k].pointSkill === e.details[l].pointSkill) {
                                b.details[k].points += e.details[l].points;
                            }
                        }
                    }
                    return b;
                };
                for (var k = 0; k < eDances[i].entries.length; k++) {
                    var eEntry = eDances[i].entries[k];
                    var found = false;
                    for (var l = 0; l < bDances[foundIndex].entries.length; l++) {
                        var bEntry = bDances[foundIndex].entries[l];
                        if (bEntry.pointSkill === eEntry.pointSkill) {
                            bEntry.points = mergePoints(bEntry.points, eEntry.points);
                            if (bEntry.lastCompetition < eEntry.lastCompetition) {
                                bEntry.lastCompetition = eEntry.lastCompetition;
                            }
                            if (bEntry.startTime > eEntry.startTime && eEntry.startTime !== null) {
                                bEntry.startTime = eEntry.startTime;
                            }
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        bDances[foundIndex].entries.push(eEntry);
                    }
                }
            }
        }
        return base;
    };
    DataParserService.prototype.parseDancer = function (person) {
        var summary = this.getSummary(person);
        return {
            dancerName: person.dancer,
            summary: summary,
            competitions: person.Competitions.map(function (c) { return c.toJSONable(); })
        };
    };
    DataParserService.prototype.getCompetitions = function (person) {
        var comps = [];
        var _loop_1 = function (i) {
            comps.push({
                competition: person.Competitions[i].toJSONable(),
                dances: person.Competitions[i].dancedEvents.map(function (d) {
                    return {
                        point: d.calcPoint(person.dancer),
                        isFinal: d.getPlacement(person.dancer).isFinal,
                        coupleCount: d.CoupleCount,
                        style: d.style,
                        pointSkill: d.pointSkill,
                        eventSkill: d.eventSkill.type,
                        placement: d.getPlacement(person.dancer).placement,
                        dances: d.dances,
                        partner: d.getPartner(person.dancer),
                        compCode: person.Competitions[i].linkCode,
                        heatid: d.heatid
                    };
                })
            });
        };
        for (var i = 0; i < person.Competitions.length; i++) {
            _loop_1(i);
        }
        comps.sort(function (a, b) { return b.competition.date - a.competition.date; });
        return comps;
    };
    DataParserService.prototype.getSummary = function (person) {
        var styles = person.Styles;
        var summary = {};
        for (var style in styles) {
            if (!styles.hasOwnProperty(style)) {
                continue;
            }
            var danceSummaries = [];
            var tmp = {};
            for (var i = 0; i < styles[style].length; i++) {
                var danceEvent = styles[style][i];
                for (var j = 0; j < danceEvent.dances.length; j++) {
                    tmp[danceEvent.dances[j]] = tmp[danceEvent.dances[j]] || {};
                    tmp[danceEvent.dances[j]][danceEvent.pointSkill] = tmp[danceEvent.dances[j]][danceEvent.pointSkill] || [];
                    tmp[danceEvent.dances[j]][danceEvent.pointSkill].push(danceEvent);
                }
            }
            for (var danceType in tmp) {
                if (!tmp.hasOwnProperty(danceType)) {
                    continue;
                }
                var entries = [];
                var highestSkill = Object.getOwnPropertyNames(tmp[danceType]).map(function (s) { return parseInt(s, 10); }).sort();
                var _loop_2 = function (danceSkill) {
                    var points = {
                        overall: 0,
                        details: []
                    };
                    for (var ds in tmp[danceType]) {
                        if (!tmp[danceType].hasOwnProperty(ds)) {
                            continue;
                        }
                        var p = tmp[danceType][ds].reduce(function (prev, c) {
                            for (var i = 0; i < Rules_1.Rules.NoPointExceptions.length; i++) {
                                if (c.Competition.rawName.toLowerCase().indexOf(Rules_1.Rules.NoPointExceptions[i].name.toLowerCase()) !== -1) {
                                    return prev;
                                }
                            }
                            return prev + c.calcPoint(person.dancer, danceSkill).value;
                        }, 0);
                        points.overall += p;
                        if (p > 0) {
                            points.details.push({ pointSkill: parseInt(ds, 10), points: p });
                        }
                    }
                    var startTime = null;
                    var lastCompetition = null;
                    if (tmp[danceType].hasOwnProperty(danceSkill)) {
                        var sorted = tmp[danceType][danceSkill].sort(function (a, b) {
                            return a.Competition.date - b.Competition.date;
                        });
                        startTime = sorted[0].Competition.date;
                        lastCompetition = sorted[sorted.length - 1].Competition.date;
                    }
                    entries.push({
                        pointSkill: danceSkill,
                        points: points,
                        startTime: startTime,
                        lastCompetition: lastCompetition,
                    });
                };
                for (var danceSkill = 0; danceSkill <= highestSkill[highestSkill.length - 1]; danceSkill++) {
                    _loop_2(danceSkill);
                }
                danceSummaries.push({
                    dance: parseInt(danceType, 10),
                    entries: entries
                });
            }
            summary[Types_1.StyleTypes[style]] = { style: style, dances: danceSummaries };
        }
        return summary;
    };
    DataParserService.VERSION = '1.7';
    DataParserService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], DataParserService);
    return DataParserService;
}());
exports.DataParserService = DataParserService;
//# sourceMappingURL=data-loader.service.js.map