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
var Types_1 = require("../../../common/o2cm-parser/entities/Types");
var Utils_1 = require("../../Utils");
var Competition_1 = require("../../../common/o2cm-parser/entities/Competition");
var router_1 = require("@angular/router");
var DanceEvent_1 = require("../../../common/o2cm-parser/entities/DanceEvent");
var EventListComponent = /** @class */ (function () {
    function EventListComponent(dataService, route) {
        var _this = this;
        this.dataService = dataService;
        this.route = route;
        this.danceFilter = -1;
        this.styleFilter = -1;
        this.skillFilter = -1;
        this.isFinalsFilter = -1;
        this.showPercentage = false;
        this.PointSkillTypesArray = Utils_1.Utils.enumToArray(Types_1.PointSkillTypes);
        this.StyleTypesArray = Utils_1.Utils.enumToArray(Types_1.StyleTypes);
        this.DanceTypesArray = Utils_1.Utils.enumToArray(Types_1.DanceTypes);
        this.PointSkillTypesArray.unshift({ key: -1, value: 'Skill filter' });
        this.StyleTypesArray.unshift({ key: -1, value: 'Style filter' });
        this.DanceTypesArray.unshift({ key: -1, value: 'Dance filter' });
        this.dataService.data.subscribe(function () {
            _this.updateFiltered();
        });
        route.queryParams.subscribe(function (value) {
            if (value['danceFilter']) {
                _this.danceFilter = parseInt(value['danceFilter'] + '', 10);
            }
            if (value['styleFilter']) {
                _this.styleFilter = parseInt(value['styleFilter'] + '', 10);
            }
            if (value['skillFilter']) {
                _this.skillFilter = parseInt(value['skillFilter'] + '', 10);
            }
            if (value['isFinalsFilter']) {
                _this.isFinalsFilter = parseInt(value['isFinalsFilter'] + '', 10);
            }
            _this.updateFiltered();
        });
    }
    EventListComponent.prototype.onPointPresentatoinChange = function () {
        this.showPercentage = !this.showPercentage;
    };
    EventListComponent.prototype.updateFiltered = function () {
        var _this = this;
        this.danceFilter = parseInt(this.danceFilter + '', 10);
        this.styleFilter = parseInt(this.styleFilter + '', 10);
        this.skillFilter = parseInt(this.skillFilter + '', 10);
        this.isFinalsFilter = parseInt(this.isFinalsFilter + '', 10);
        var filteredComps = this.dataService.data.value.competitions.map(function (c) {
            var cClone = Competition_1.Competition.shallowCopy(c);
            cClone.dancedEvents = c.dancedEvents.filter(function (d) {
                if (_this.danceFilter !== -1 && d.dances.indexOf(_this.danceFilter) === -1) {
                    return false;
                }
                if (_this.styleFilter !== -1 && d.style !== _this.styleFilter) {
                    return false;
                }
                if (_this.skillFilter !== -1 && d.pointSkill !== _this.skillFilter) {
                    return false;
                }
                var plm = DanceEvent_1.DanceEvent.getPlacement(d, _this.dataService.data.getValue().dancerName);
                if (_this.isFinalsFilter !== -1 &&
                    plm &&
                    plm.isFinal !== (_this.isFinalsFilter === 0)) {
                    return false;
                }
                return true;
            }).sort(function (a, b) { return a.style - b.style; });
            return cClone;
        }).filter(function (cl) { return cl.dancedEvents.length > 0; }).sort(function (a, b) { return b.date - a.date; });
        if (filteredComps.length > 5) {
            this.filteredComps = filteredComps.slice(0, 5);
            setTimeout(function () {
                _this.filteredComps = filteredComps;
            }, 0);
        }
        else {
            this.filteredComps = filteredComps;
        }
    };
    EventListComponent = __decorate([
        core_1.Component({
            selector: 'app-event-list',
            templateUrl: './event-list.component.html',
            styleUrls: ['./event-list.component.scss'],
        }),
        __metadata("design:paramtypes", [data_service_1.DataService,
            router_1.ActivatedRoute])
    ], EventListComponent);
    return EventListComponent;
}());
exports.EventListComponent = EventListComponent;
//# sourceMappingURL=event-list.component.js.map