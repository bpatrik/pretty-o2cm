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
var Rules_1 = require("../../services/Rules");
var Types_1 = require("../../../../common/o2cm-parser/entities/Types");
var data_service_1 = require("../../services/data.service");
var DanceEvent_1 = require("../../../../common/o2cm-parser/entities/DanceEvent");
var CompetitionEventListComponent = /** @class */ (function () {
    function CompetitionEventListComponent(dataService) {
        this.dataService = dataService;
        this.pointPresentation = new core_1.EventEmitter();
        this.compactLayout = false;
        this.PointSkillTypes = Types_1.PointSkillTypes;
    }
    CompetitionEventListComponent.prototype.noPointReason = function () {
        for (var i = 0; i < Rules_1.Rules.NoPointExceptions.length; i++) {
            if (this.competition.rawName.toLowerCase().indexOf(Rules_1.Rules.NoPointExceptions[i].name.toLowerCase()) !== -1) {
                return Rules_1.Rules.NoPointExceptions[i].reason;
            }
        }
        return null;
    };
    CompetitionEventListComponent.prototype.getNewPoints = function () {
        if (this.noPointReason() !== null) {
            return [];
        }
        var tmp = {};
        for (var i = 0; i < this.competition.dancedEvents.length; i++) {
            var key = this.competition.dancedEvents[i].pointSkill;
            tmp[key] = tmp[key] || 0;
            tmp[key] += DanceEvent_1.DanceEvent.calcPoint(this.competition.dancedEvents[i], this.dancer).value;
        }
        var ret = [];
        for (var key in tmp) {
            if (!tmp.hasOwnProperty(key) || tmp[key] === 0) {
                continue;
            }
            ret.push({ color: Types_1.PointSkillTypes[parseInt(key, 10)].toLowerCase(), points: tmp[key], skill: parseInt(key, 10) });
        }
        return ret;
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CompetitionEventListComponent.prototype, "pointPresentation", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CompetitionEventListComponent.prototype, "showPercentage", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CompetitionEventListComponent.prototype, "competition", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CompetitionEventListComponent.prototype, "dancer", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CompetitionEventListComponent.prototype, "compactLayout", void 0);
    CompetitionEventListComponent = __decorate([
        core_1.Component({
            selector: 'app-competition-event-list',
            templateUrl: './competition.event-list.component.html',
            styleUrls: ['./competition.event-list.component.scss'],
        }),
        __metadata("design:paramtypes", [data_service_1.DataService])
    ], CompetitionEventListComponent);
    return CompetitionEventListComponent;
}());
exports.CompetitionEventListComponent = CompetitionEventListComponent;
//# sourceMappingURL=competition.event-list.component.js.map