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
var Competition_1 = require("../../../common/o2cm-parser/entities/Competition");
var DanceEvent_1 = require("../../../common/o2cm-parser/entities/DanceEvent");
var QueryParams_1 = require("../QueryParams");
var CompareComponent = /** @class */ (function () {
    function CompareComponent(dataService, route) {
        var _this = this;
        this.dataService = dataService;
        this.route = route;
        this.showPercentage = false;
        this.filteredCompetitions = [];
        route.queryParams.subscribe(function (value) {
            if (value[QueryParams_1.QueryParams.competitor.firstName] && value[QueryParams_1.QueryParams.competitor.lastName] &&
                !_this.competitor || (value[QueryParams_1.QueryParams.competitor.firstName] !== _this.competitor.firstName &&
                value[QueryParams_1.QueryParams.competitor.lastName] !== _this.competitor.lastName)) {
                _this.competitor = {
                    firstName: value[QueryParams_1.QueryParams.competitor.firstName],
                    lastName: value[QueryParams_1.QueryParams.competitor.lastName]
                };
                _this.onUpdate();
            }
        });
    }
    CompareComponent.prototype.onUpdate = function () {
        var _this = this;
        this.filteredCompetitions = this.dataService.data.getValue().competitions.map(function (c) {
            var cClone = Competition_1.Competition.shallowCopy(c);
            cClone.dancedEvents = cClone.dancedEvents.filter(function (d) { return DanceEvent_1.DanceEvent.hasDancer(d, _this.competitor); });
            return cClone;
        }).filter(function (c) { return c.dancedEvents.length > 0; }).sort(function (a, b) { return b.date - a.date; });
    };
    CompareComponent.prototype.onPointPresentatoinChange = function () {
        this.showPercentage = !this.showPercentage;
    };
    CompareComponent = __decorate([
        core_1.Component({
            selector: 'app-compare-component',
            templateUrl: './compare.component.html',
            styleUrls: ['./compare.component.scss'],
        }),
        __metadata("design:paramtypes", [data_service_1.DataService,
            router_1.ActivatedRoute])
    ], CompareComponent);
    return CompareComponent;
}());
exports.CompareComponent = CompareComponent;
//# sourceMappingURL=compare.component.js.map