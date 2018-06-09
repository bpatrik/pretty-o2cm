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
var Rules_1 = require("../../../services/Rules");
var Types_1 = require("../../../../../common/o2cm-parser/entities/Types");
var DanceEvent_1 = require("../../../../../common/o2cm-parser/entities/DanceEvent");
var data_service_1 = require("../../../services/data.service");
var Placement_1 = require("../../../../../common/o2cm-parser/entities/Placement");
var CompetitionEventComponent = /** @class */ (function () {
    function CompetitionEventComponent(dataService) {
        this.dataService = dataService;
        this.StyleTypes = Types_1.StyleTypes;
        this.DanceTypes = Types_1.DanceTypes;
        this.PointSkillTypes = Types_1.PointSkillTypes;
        this.EventSkillTypes = Types_1.EventSkillTypes;
        this.Rules = Rules_1.Rules;
        this.pointPresentation = new core_1.EventEmitter();
    }
    Object.defineProperty(CompetitionEventComponent.prototype, "Dance", {
        get: function () {
            return this.dance;
        },
        set: function (dance) {
            this.dance = dance;
            this.onUpdate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompetitionEventComponent.prototype, "Dancer", {
        get: function () {
            return this.dancer;
        },
        set: function (value) {
            this.dancer = value;
            this.onUpdate();
        },
        enumerable: true,
        configurable: true
    });
    CompetitionEventComponent.prototype.onUpdate = function () {
        if (!this.dance || !this.dancer) {
            return;
        }
        if (window.screen.width < 576) {
            this.compactLayout = true;
        }
        this.myPlacement = DanceEvent_1.DanceEvent.getPlacement(this.dance, this.dancer);
        this.myPartner = Placement_1.Placement.getPartner(this.myPlacement, this.dancer);
        this.myPoint = DanceEvent_1.DanceEvent.calcPointForPlacement(this.dance, this.myPlacement);
        this.color = Types_1.PointSkillTypes[this.dance.pointSkill].toLowerCase();
    };
    CompetitionEventComponent.prototype.percent = function () {
        return Math.round((this.dance.placements.length - this.myPlacement.placement) / this.dance.placements.length * 100);
    };
    CompetitionEventComponent.prototype.url = function () {
        return window.location.origin +
            window.location.pathname +
            '?firstName=' +
            this.myPartner.firstName +
            '&lastName=' +
            this.myPartner.lastName;
    };
    CompetitionEventComponent.prototype.pointWarningStr = function () {
        switch (this.myPoint.warning) {
            case DanceEvent_1.PointWarning.NOQF_W_MANY_COUPELS:
                return 'No quarter final detected, but more then 20 couples were competing';
            case DanceEvent_1.PointWarning.QF_W_FEW_COUPLES:
                return 'Quarter final detected, but too few couples were competing';
        }
        return '';
    };
    CompetitionEventComponent.prototype.renderDances = function () {
        var txt = '';
        for (var i = 0; i < this.dance.dances.length; i++) {
            txt += Types_1.DanceTypes[this.dance.dances[i]];
            if (i < this.dance.dances.length - 1) {
                txt += ' / ';
            }
        }
        if (txt.length > 10 && this.compactLayout === true) {
            txt = '';
            for (var i = 0; i < this.dance.dances.length; i++) {
                txt += Types_1.DanceTypes.toLetter[this.dance.dances[i]];
                if (i < this.dance.dances.length - 1) {
                    txt += '/';
                }
            }
        }
        return txt;
    };
    CompetitionEventComponent.prototype.partnerRoleImg = function () {
        if (this.myPartner === this.myPlacement.leader) {
            return 'leader.svg';
        }
        else if (this.myPartner === this.myPlacement.follower) {
            return 'follower.svg';
        }
        return 'couple.svg';
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CompetitionEventComponent.prototype, "noPointReason", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CompetitionEventComponent.prototype, "compactLayout", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], CompetitionEventComponent.prototype, "Dance", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CompetitionEventComponent.prototype, "competition", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], CompetitionEventComponent.prototype, "Dancer", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CompetitionEventComponent.prototype, "showPercentage", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CompetitionEventComponent.prototype, "pointPresentation", void 0);
    CompetitionEventComponent = __decorate([
        core_1.Component({
            selector: 'app-competition-event',
            templateUrl: './event.competition.list.component.html',
            styleUrls: ['./event.competition.list.component.scss'],
        }),
        __metadata("design:paramtypes", [data_service_1.DataService])
    ], CompetitionEventComponent);
    return CompetitionEventComponent;
}());
exports.CompetitionEventComponent = CompetitionEventComponent;
//# sourceMappingURL=event.competition.list.component.js.map