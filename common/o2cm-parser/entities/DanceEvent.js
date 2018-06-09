"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Placement_1 = require("./Placement");
var Types_1 = require("./Types");
var Dancer_1 = require("./Dancer");
var PointWarning;
(function (PointWarning) {
    PointWarning[PointWarning["QF_W_FEW_COUPLES"] = 0] = "QF_W_FEW_COUPLES";
    PointWarning[PointWarning["NOQF_W_MANY_COUPELS"] = 1] = "NOQF_W_MANY_COUPELS";
})(PointWarning = exports.PointWarning || (exports.PointWarning = {}));
var DanceEvent = /** @class */ (function () {
    function DanceEvent(raw, heatid, division, age, eventSkill, style, dances) {
        this.raw = raw;
        this.heatid = heatid;
        this.division = division;
        this.age = age;
        this.eventSkill = eventSkill;
        this.style = style;
        this.dances = dances;
        this.placements = [];
        this.rounds = 0;
        this.pointSkill = Types_1.EventSkillTypes.toPointSkillType(this.eventSkill.type);
    }
    DanceEvent.getPlacement = function (that, dancer) {
        for (var i = 0; i < that.placements.length; i++) {
            if (Placement_1.Placement.hasDancer(that.placements[i], dancer)) {
                return that.placements[i];
            }
        }
        return null;
    };
    DanceEvent.hasQuarterFinal = function (that) {
        return that.rounds >= 2 || that.placements.length >= 20;
    };
    DanceEvent.pointWarning = function (that) {
        if (that.rounds >= 2 && that.placements.length <= 15) {
            return PointWarning.QF_W_FEW_COUPLES; // 'Quarter final detected, but too few couples were competing';
        }
        if (that.rounds < 2 && that.placements.length >= 20 && that.placements.length < 40) {
            return PointWarning.NOQF_W_MANY_COUPELS; // 'No quarter final detected, but more then 20 couples were competing';
        }
        return null;
    };
    DanceEvent.hasDancer = function (that, dancer) {
        for (var i = 0; i < that.placements.length; i++) {
            if (Placement_1.Placement.hasDancer(that.placements[i], dancer)) {
                return true;
            }
        }
        return false;
    };
    DanceEvent.calcPointForPlacement = function (that, placement, skill) {
        if (skill === void 0) { skill = that.pointSkill; }
        var warning = null;
        var point = 0;
        if (!placement.isFinal || skill > that.pointSkill) {
            return { value: point, warning: warning };
        }
        if (placement.placement === 1) {
            point = 3;
        }
        if (placement.placement === 2) {
            point = 2;
        }
        if (placement.placement === 3) {
            point = 1;
        }
        if (DanceEvent.hasQuarterFinal(that)) {
            if (placement.placement >= 4 && placement.placement <= 6) {
                point = 1;
                warning = DanceEvent.pointWarning(that);
            }
        }
        if (skill === that.pointSkill - 1) {
            point *= 2;
        }
        if (skill < that.pointSkill - 1) {
            point = 7;
        }
        return { value: point, warning: warning };
    };
    DanceEvent.calcPoint = function (that, dancer, skill) {
        if (skill === void 0) { skill = that.pointSkill; }
        var placement = DanceEvent.getPlacement(that, dancer);
        return DanceEvent.calcPointForPlacement(that, placement, skill);
    };
    DanceEvent.prototype.toString = function () {
        return {
            raw: this.raw,
            division: Types_1.DivisionTypes[this.division],
            age: Types_1.AgeTypes[this.age],
            skill: Types_1.EventSkillTypes[this.eventSkill.type],
            style: Types_1.StyleTypes[this.style],
            dances: this.dances.map(function (v) { return Types_1.DanceTypes[v]; })
        };
    };
    DanceEvent.prototype.hasDancer = function (dancer) {
        return DanceEvent.hasDancer(this, dancer);
    };
    DanceEvent.prototype.addPlacement = function (placement) {
        this.placements.push(placement);
    };
    DanceEvent.prototype.calcPoint = function (dancer, skill) {
        return DanceEvent.calcPoint(this, dancer, skill);
    };
    Object.defineProperty(DanceEvent.prototype, "Competition", {
        get: function () {
            return this.competition;
        },
        set: function (comp) {
            this.competition = comp;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DanceEvent.prototype, "CoupleCount", {
        get: function () {
            return this.placements.length;
        },
        enumerable: true,
        configurable: true
    });
    DanceEvent.prototype.getPlacement = function (dancer) {
        return DanceEvent.getPlacement(this, dancer);
    };
    DanceEvent.prototype.getPartner = function (dancer) {
        for (var i = 0; i < this.placements.length; i++) {
            if (this.placements[i].hasDancer(dancer)) {
                if (this.placements[i].leader.equals(dancer)) {
                    return this.placements[i].follower || new Dancer_1.Dancer('TBA');
                }
                else {
                    return this.placements[i].leader || new Dancer_1.Dancer('TBA');
                }
            }
        }
    };
    DanceEvent.prototype.toJSONable = function () {
        return {
            age: this.age,
            heatid: this.heatid,
            dances: this.dances,
            division: this.division,
            eventSkill: this.eventSkill,
            placements: this.placements.map(function (p) { return p.toJSONable(); }),
            pointSkill: this.pointSkill,
            raw: this.raw,
            style: this.style,
            rounds: this.rounds
        };
    };
    return DanceEvent;
}());
exports.DanceEvent = DanceEvent;
//# sourceMappingURL=DanceEvent.js.map