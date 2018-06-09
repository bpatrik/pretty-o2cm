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
var data_service_1 = require("../../../services/data.service");
var Types_1 = require("../../../../../common/o2cm-parser/entities/Types");
var Rules_1 = require("../../../services/Rules");
var StylePanelEntryComponent = /** @class */ (function () {
    function StylePanelEntryComponent(dataService) {
        this.dataService = dataService;
        this.showSubEntries = new core_1.EventEmitter();
        this.StyleTypes = Types_1.StyleTypes;
        this.DanceTypes = Types_1.DanceTypes;
        this.PointSkillTypes = Types_1.PointSkillTypes;
        this.Rules = Rules_1.Rules;
    }
    StylePanelEntryComponent.prototype.latestEvent = function (events) {
        events.sort(function (a, b) {
            return b.lastCompetition - a.lastCompetition;
        });
        return events[0];
    };
    StylePanelEntryComponent.prototype.restEvents = function (events) {
        events.sort(function (a, b) {
            return b.lastCompetition - a.lastCompetition;
        });
        return events.slice(1);
    };
    StylePanelEntryComponent.prototype.daysLeft = function (event) {
        var length = Rules_1.Rules.Timeout[event.pointSkill];
        var left = (event.startTime + length) - Date.now();
        if (left <= 0) {
            return -1;
        }
        return Math.ceil(left / 1000 / 60 / 60 / 24);
    };
    StylePanelEntryComponent.prototype.progress = function () {
        var timeP = 0;
        var pointP = 0;
        if (Rules_1.Rules.Timeout[this.eventSummary.pointSkill]) {
            var length_1 = Rules_1.Rules.Timeout[this.eventSummary.pointSkill];
            var left = (this.eventSummary.startTime + length_1) - Date.now();
            timeP = (length_1 - left) / length_1;
        }
        if (Rules_1.Rules.MaxPoints[this.eventSummary.pointSkill]) {
            pointP = this.eventSummary.points.overall / Rules_1.Rules.MaxPoints[this.eventSummary.pointSkill];
        }
        return Math.round(Math.max(timeP, pointP) * 100);
    };
    StylePanelEntryComponent.prototype.color = function () {
        return Types_1.PointSkillTypes[this.eventSummary.pointSkill].toLowerCase();
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], StylePanelEntryComponent.prototype, "showSubEntries", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], StylePanelEntryComponent.prototype, "eventSummary", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], StylePanelEntryComponent.prototype, "danceType", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], StylePanelEntryComponent.prototype, "styleType", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], StylePanelEntryComponent.prototype, "mainEntry", void 0);
    StylePanelEntryComponent = __decorate([
        core_1.Component({
            selector: 'app-style-panel-entry-component',
            templateUrl: './entry.style-panel.component.html',
            styleUrls: ['./entry.style-panel.component.scss'],
        }),
        __metadata("design:paramtypes", [data_service_1.DataService])
    ], StylePanelEntryComponent);
    return StylePanelEntryComponent;
}());
exports.StylePanelEntryComponent = StylePanelEntryComponent;
//# sourceMappingURL=entry.style-panel.component.js.map