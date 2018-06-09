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
var DanceEvent_1 = require("../../../../common/o2cm-parser/entities/DanceEvent");
var data_service_1 = require("../../services/data.service");
var Dancer_1 = require("../../../../common/o2cm-parser/entities/Dancer");
var RoleType_1 = require("../RoleType");
var Types_1 = require("../../../../common/o2cm-parser/entities/Types");
var CompetitorsPanelComponent = /** @class */ (function () {
    function CompetitorsPanelComponent(dataService) {
        this.dataService = dataService;
        this.short = false;
        this.RoleType = RoleType_1.RoleType;
        this.expand = false;
        this.rankings = [];
        this.myRank = 0;
        this.min = {
            score: 0,
        };
        this.max = {
            score: 0,
            scoreDiff: 0
        };
        this.maxRender = {
            compact: 8,
            expanded: 30
        };
        this.gotBetterCount = 0;
        this.renderSections = {
            openTop: false,
            expandedOpenTop: false,
            first: {
                start: 0,
                end: 0
            }
        };
        this.updateRenderBoundaries();
    }
    CompetitorsPanelComponent_1 = CompetitorsPanelComponent;
    CompetitorsPanelComponent.prototype.ngOnChanges = function () {
        if (this.short) {
            this.maxRender.compact = 4;
        }
        else {
            this.maxRender.compact = 8;
        }
        if (this.danceEvents && typeof this.roleFilter !== 'undefined') {
            this.roleFilter = parseInt(this.roleFilter + '', 10);
            this.calcRanks();
        }
        this.updateRenderBoundaries();
    };
    CompetitorsPanelComponent.prototype.updateRenderBoundaries = function () {
        this.renderSections.expandedOpenTop = Math.floor(Math.max(0, this.myRank - this.maxRender.expanded / 2)) > 0;
        if (this.expand) {
            this.renderSections.first.start = Math.floor(Math.max(0, this.myRank - this.maxRender.expanded / 2));
            this.renderSections.first.end = Math.floor(Math.min(this.rankings.length - 1, Math.max(this.myRank + this.maxRender.expanded / 2, this.renderSections.first.start + this.maxRender.expanded)));
            if (window['debug'] === true) {
                this.renderSections.first.start = 0;
                this.renderSections.first.end = this.rankings.length - 1;
            }
        }
        else {
            this.renderSections.first.start = Math.max(0, this.myRank - this.maxRender.compact / 2);
            this.renderSections.first.end = Math.min(this.rankings.length - 1, this.myRank + this.maxRender.compact / 2);
        }
        this.renderSections.openTop = this.renderSections.first.start > 0;
    };
    CompetitorsPanelComponent.prototype.calcRanks = function () {
        var _this = this;
        var list = {};
        var me = this.dataService.data.getValue().dancerName;
        this.danceEvents.sort(function (a, b) { return a.date - b.date; });
        var lastCompDate = this.danceEvents[this.danceEvents.length - 1].date;
        var round = function (a) {
            return Math.round(a * 100000) / 100000;
        };
        var _loop_1 = function (i) {
            var myPlacement = DanceEvent_1.DanceEvent.getPlacement(this_1.danceEvents[i], me);
            var _loop_2 = function (j) {
                var plm = this_1.danceEvents[i].placements[j];
                var point = round((myPlacement.placement - this_1.danceEvents[i].placements[j].placement) / this_1.danceEvents[i].placements.length);
                var H = (1000 * 60 * 60 * 24 * 182);
                var accuracy = Math.pow(10, -(this_1.comparingDate - this_1.danceEvents[i].date) / H);
                if (accuracy > 1 || accuracy < 0) {
                    console.error('accuracy error');
                    console.log(accuracy, lastCompDate, this_1.danceEvents[i].date, CompetitorsPanelComponent_1.tenPercentDivider, plm);
                }
                var correctedPoints = point * accuracy;
                var addPoint = function (dancer, role) {
                    var key = (dancer.firstName + ' ' + dancer.lastName).trim();
                    list[key] = list[key] || {
                        points: 0, accuracy: 0,
                        role: role, fromLastComp: 0, previousScore: 0
                    };
                    list[key].points += correctedPoints;
                    list[key].accuracy += accuracy;
                    if (window['debug'] === true) {
                        list[key].details = list[key].details || { accuracy: [], score: [] };
                        list[key].details.accuracy.push({
                            accuracy: accuracy,
                            from: new Date(_this.danceEvents[i].date).toDateString() + ', ' + Types_1.DanceTypes[_this.danceEvents[i].dances[0]]
                        });
                        list[key].details.score.push({
                            score: correctedPoints,
                            from: new Date(_this.danceEvents[i].date).toDateString() + ', ' + Types_1.DanceTypes[_this.danceEvents[i].dances[0]]
                        });
                    }
                    if (plm === myPlacement && Dancer_1.Dancer.equals(dancer, me)) {
                        list[key].accuracy += 999;
                    }
                    if (_this.danceEvents[i].date === lastCompDate) {
                        list[key].fromLastComp += correctedPoints;
                    }
                    else {
                        list[key].previousScore = list[key].points;
                    }
                    list[key].role = list[key].role === role ? role : RoleType_1.RoleType.Mixed;
                };
                if (plm.follower && !Dancer_1.Dancer.isTBA(plm.follower)) {
                    addPoint(plm.follower, RoleType_1.RoleType.Follow);
                }
                if (plm.leader && !Dancer_1.Dancer.isTBA(plm.leader)) {
                    addPoint(plm.leader, RoleType_1.RoleType.Lead);
                }
            };
            for (var j = 0; j < this_1.danceEvents[i].placements.length; j++) {
                _loop_2(j);
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.danceEvents.length; i++) {
            _loop_1(i);
        }
        var rankings = Object.keys(list);
        this.rankings = rankings.map(function (key) {
            return {
                dancer: Dancer_1.Dancer.getName(key),
                score: list[key].points,
                accuracy: list[key].accuracy,
                role: list[key].role,
                gotBetter: list[key].fromLastComp < 0 && list[key].previousScore > 0,
                details: list[key].details
            };
        }).sort(function (a, b) {
            if (b.accuracy === a.accuracy) {
                return Dancer_1.Dancer.compare(a.dancer, b.dancer);
            }
            return b.accuracy - a.accuracy;
        });
        var endIndex = this.rankings.findIndex(function (r) { return (r.accuracy < _this.rankings[1].accuracy * 0.3); }); // first one is 'me'
        endIndex = Math.min(endIndex, rankings.length * 0.5, 300);
        endIndex = Math.max(endIndex, this.maxRender.expanded);
        //    console.log(this.panelName, avgAcc, this.rankings[1].accuracy);
        if (this.rankings[Math.floor(this.rankings.length / 3)].accuracy === this.rankings[this.rankings.length - 1].accuracy) {
            endIndex = this.rankings.length - 1;
        }
        if (window['fullRanking'] === true) {
            endIndex = this.rankings.length;
        }
        this.rankings = this.rankings.slice(0, endIndex)
            .filter(function (r) { return r.role === _this.roleFilter ||
            r.role === RoleType_1.RoleType.Mixed ||
            _this.roleFilter === RoleType_1.RoleType.Mixed ||
            Dancer_1.Dancer.equals(r.dancer, me); });
        this.rankings = this.rankings.sort(function (a, b) {
            if (b.score === a.score) {
                return Dancer_1.Dancer.compare(a.dancer, b.dancer);
            }
            return b.score - a.score;
        });
        this.min.score = this.rankings[this.rankings.length - 1].score;
        this.max.score = this.rankings[0].score;
        this.max.scoreDiff = Math.max(Math.abs(this.max.score), Math.abs(this.min.score));
        for (var i = 0; i < this.rankings.length; i++) {
            if (Dancer_1.Dancer.equals(this.rankings[i].dancer, me)) {
                this.myRank = i;
                break;
            }
        }
        this.gotBetterCount = this.rankings.filter(function (r) { return r.gotBetter === true; }).length;
    };
    CompetitorsPanelComponent.prototype.url = function (dancer) {
        return window.location.origin +
            window.location.pathname +
            '?firstName=' +
            dancer.firstName +
            '&lastName=' +
            dancer.lastName;
    };
    CompetitorsPanelComponent.prototype.toggleExpand = function () {
        this.expand = !this.expand;
        this.updateRenderBoundaries();
    };
    CompetitorsPanelComponent.prototype.componentToHex = function (c) {
        var hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    CompetitorsPanelComponent.prototype.rgbToHex = function (r, g, b) {
        return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    };
    CompetitorsPanelComponent.prototype.color = function (score) {
        var color = [0, 0, 0];
        var max = Math.min(Math.abs(this.max.score), Math.abs(this.min.score));
        if (max === 0) {
            max += Number.EPSILON;
        }
        var endColor = score > 0 ? CompetitorsPanelComponent_1.COLOR_STRONGER : CompetitorsPanelComponent_1.COLOR_WEAKER;
        var multiple = Math.min(Math.abs(score / max), 1);
        for (var i = 0; i < 3; i++) {
            color[i] = Math.floor((endColor[i] - CompetitorsPanelComponent_1.COLOR_EQUAL[i]) * multiple
                + CompetitorsPanelComponent_1.COLOR_EQUAL[i]);
        }
        return this.rgbToHex(color[0], color[1], color[2]);
    };
    CompetitorsPanelComponent.prototype.isBetter = function (score) {
        return score > this.max.scoreDiff * 0.08;
    };
    CompetitorsPanelComponent.prototype.isTheSame = function (score) {
        return score < this.max.scoreDiff * 0.08 && score > -this.max.scoreDiff * 0.08;
    };
    CompetitorsPanelComponent.prototype.isWorst = function (score) {
        return score < -this.max.scoreDiff * 0.08;
    };
    CompetitorsPanelComponent.prototype.placementDescription = function () {
        var divisions = [0.05, 0.1, 0.15, 0.2, 0.25];
        for (var i = 0; i < divisions.length; i++) {
            if (this.myRank < this.rankings.length * divisions[i]) {
                return '- top ' + divisions[i] * 100 + '%';
            }
        }
        return '';
    };
    CompetitorsPanelComponent.prototype.showRanking = function () {
        return this.renderSections.expandedOpenTop === false ||
            this.myRank <= this.rankings.length - this.maxRender.expanded / 6;
    };
    CompetitorsPanelComponent.prototype.roleImg = function (role) {
        switch (role) {
            case RoleType_1.RoleType.Mixed:
                return 'couple.svg';
            case RoleType_1.RoleType.Lead:
                return 'leader.svg';
            case RoleType_1.RoleType.Follow:
                return 'follower.svg';
        }
    };
    CompetitorsPanelComponent.tenPercentDivider = (1000 * 60 * 60 * 24 * 182) / 0.7;
    CompetitorsPanelComponent.COLOR_STRONGER = [255, 193, 7];
    CompetitorsPanelComponent.COLOR_EQUAL = [0, 123, 255];
    CompetitorsPanelComponent.COLOR_WEAKER = [40, 167, 69];
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CompetitorsPanelComponent.prototype, "panelName", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], CompetitorsPanelComponent.prototype, "roleFilter", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], CompetitorsPanelComponent.prototype, "danceEvents", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CompetitorsPanelComponent.prototype, "short", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], CompetitorsPanelComponent.prototype, "comparingDate", void 0);
    CompetitorsPanelComponent = CompetitorsPanelComponent_1 = __decorate([
        core_1.Component({
            selector: 'app-competitors-panel-component',
            templateUrl: './panel.competitors.component.html',
            styleUrls: ['./panel.competitors.component.scss'],
        }),
        __metadata("design:paramtypes", [data_service_1.DataService])
    ], CompetitorsPanelComponent);
    return CompetitorsPanelComponent;
    var CompetitorsPanelComponent_1;
}());
exports.CompetitorsPanelComponent = CompetitorsPanelComponent;
//# sourceMappingURL=panel.competitors.component.js.map