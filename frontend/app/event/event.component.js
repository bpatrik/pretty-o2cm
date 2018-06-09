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
var data_service_1 = require("../services/data.service");
var router_1 = require("@angular/router");
var DanceEvent_1 = require("../../../common/o2cm-parser/entities/DanceEvent");
var Dancer_1 = require("../../../common/o2cm-parser/entities/Dancer");
var Types_1 = require("../../../common/o2cm-parser/entities/Types");
var Rules_1 = require("../services/Rules");
var QueryParams_1 = require("../QueryParams");
var EventComponent = /** @class */ (function () {
    function EventComponent(dataService, route) {
        var _this = this;
        this.dataService = dataService;
        this.route = route;
        this.eventFilter = {
            compCode: '',
            heatid: '',
        };
        route.queryParams.subscribe(function (value) {
            _this.eventFilter.compCode = value[QueryParams_1.QueryParams.compCode];
            _this.eventFilter.heatid = value[QueryParams_1.QueryParams.heatid];
            _this.getDanceEvent();
        });
        this.dataService.data.subscribe(function () {
            _this.getDanceEvent();
        });
    }
    EventComponent.prototype.getDanceEvent = function () {
        if (!this.eventFilter.compCode || this.eventFilter.heatid) {
            return;
        }
        this.competition = null;
        for (var i = 0; i < this.dataService.data.getValue().competitions.length; i++) {
            if (this.dataService.data.getValue().competitions[i].linkCode === this.eventFilter.compCode) {
                this.competition = this.dataService.data.getValue().competitions[i];
                break;
            }
        }
        if (this.competition === null) {
            return;
        }
        this.dance = null;
        for (var i = 0; i < this.competition.dancedEvents.length; i++) {
            if (this.competition.dancedEvents[i].heatid === this.eventFilter.heatid) {
                this.dance = this.competition.dancedEvents[i];
                break;
            }
        }
        if (this.dance === null) {
            console.error('can\'t find heat id: ' + this.eventFilter.heatid);
            return;
        }
        this.dance.placements.sort(function (a, b) {
            if (a.placement === b.placement) {
                return Dancer_1.Dancer.compare(a.leader, b.leader);
            }
            return a.placement - b.placement;
        });
        var me = this.dataService.data.getValue().dancerName;
        this.myPlacementIndex = this.dance.placements.findIndex(function (plm) { return Dancer_1.Dancer.equals(plm.leader, me) || Dancer_1.Dancer.equals(plm.follower, me); });
        this.points = [];
        for (var i = 0; i < this.dance.placements.length; i++) {
            this.points.push(DanceEvent_1.DanceEvent.calcPoint(this.dance, this.dance.placements[i].leader));
        }
    };
    EventComponent.prototype.color = function () {
        return Types_1.PointSkillTypes[this.dance.pointSkill].toLowerCase();
    };
    EventComponent.prototype.noPointReason = function () {
        for (var i = 0; i < Rules_1.Rules.NoPointExceptions.length; i++) {
            if (this.competition.rawName.toLowerCase().indexOf(Rules_1.Rules.NoPointExceptions[i].name.toLowerCase()) !== -1) {
                return Rules_1.Rules.NoPointExceptions[i].reason;
            }
        }
        return null;
    };
    EventComponent.prototype.url = function (dancer) {
        return window.location.origin +
            window.location.pathname +
            '?firstName=' +
            dancer.firstName +
            '&lastName=' +
            dancer.lastName;
    };
    EventComponent = __decorate([
        core_1.Component({
            selector: 'app-event-component',
            templateUrl: './event.component.html',
            styleUrls: ['./event.component.scss'],
        }),
        __metadata("design:paramtypes", [data_service_1.DataService,
            router_1.ActivatedRoute])
    ], EventComponent);
    return EventComponent;
}());
exports.EventComponent = EventComponent;
//# sourceMappingURL=event.component.js.map