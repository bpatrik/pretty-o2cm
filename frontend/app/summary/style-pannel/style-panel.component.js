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
var Types_1 = require("../../../../common/o2cm-parser/entities/Types");
var Rules_1 = require("../../services/Rules");
var StylePanelComponent = /** @class */ (function () {
    function StylePanelComponent() {
        this.StyleTypes = Types_1.StyleTypes;
        this.DanceTypes = Types_1.DanceTypes;
        this.PointSkillTypes = Types_1.PointSkillTypes;
        this.Rules = Rules_1.Rules;
    }
    StylePanelComponent.prototype.latestEvent = function (events) {
        events.sort(function (a, b) {
            return b.lastCompetition - a.lastCompetition;
        });
        return events[0];
    };
    StylePanelComponent.prototype.restEvents = function (events) {
        return events.filter(function (e) { return e.lastCompetition !== null; }).sort(function (a, b) {
            return b.lastCompetition - a.lastCompetition;
        }).slice(1);
    };
    StylePanelComponent.prototype.color = function (dance) {
        return Types_1.PointSkillTypes[this.latestEvent(dance.entries).pointSkill].toLowerCase();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], StylePanelComponent.prototype, "styleSummary", void 0);
    StylePanelComponent = __decorate([
        core_1.Component({
            selector: 'app-style-panel-component',
            templateUrl: './style-panel.component.html',
            styleUrls: ['./style-panel.component.scss'],
        }),
        __metadata("design:paramtypes", [])
    ], StylePanelComponent);
    return StylePanelComponent;
}());
exports.StylePanelComponent = StylePanelComponent;
//# sourceMappingURL=style-panel.component.js.map