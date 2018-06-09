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
var DanceEvent_1 = require("../../../common/o2cm-parser/entities/DanceEvent");
var Types_1 = require("../../../common/o2cm-parser/entities/Types");
var RoleType_1 = require("./RoleType");
var Dancer_1 = require("../../../common/o2cm-parser/entities/Dancer");
var ng2_cookies_1 = require("ng2-cookies");
var CompetitorsComponent = /** @class */ (function () {
    function CompetitorsComponent(dataService) {
        var _this = this;
        this.dataService = dataService;
        this.perStyles = null;
        this.perDance = null;
        this.allDance = null;
        this.groupByFilter = 0;
        this.roleFilter = 0;
        this.dateStartFilter = 0;
        this.dateEndFilter = Date.now();
        this.StyleTypes = Types_1.StyleTypes;
        this.DanceTypes = Types_1.DanceTypes;
        this.RoleType = RoleType_1.RoleType;
        this.showInfo = true;
        this.showExtendedInfo = false;
        this.now = 0;
        this.now = Date.now();
        this.dateEndFilter = this.now;
        this.dataService.data.subscribe(function () {
            _this.setPotentialRole();
            _this.allDance = null;
            _this.perStyles = null;
            _this.perDance = null;
            // this.setPotentialRole();
        });
        this.setPotentialRole();
        this.showInfo = !ng2_cookies_1.Cookie.get('hideInfo');
    }
    CompetitorsComponent.prototype.setShowInfo = function (value) {
        this.showInfo = value;
        if (this.showInfo === false) {
            ng2_cookies_1.Cookie.set('hideInfo', 'true');
        }
    };
    CompetitorsComponent.prototype.updateFiltered = function () {
        if (this.dateEndFilter < this.dateStartFilter) {
            this.dateEndFilter = this.dateStartFilter;
        }
        this.allDance = null;
        this.perStyles = null;
        this.perDance = null;
    };
    Object.defineProperty(CompetitorsComponent.prototype, "AllDances", {
        get: function () {
            if (this.allDance == null) {
                this.generateAllDance();
            }
            return this.allDance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompetitorsComponent.prototype, "PerStyles", {
        get: function () {
            if (this.perStyles == null) {
                this.generateEventsPerStyle();
            }
            return this.perStyles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompetitorsComponent.prototype, "PerDance", {
        get: function () {
            if (this.perDance == null) {
                this.generateEventsPerDance();
            }
            return this.perDance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompetitorsComponent.prototype, "ascComps", {
        get: function () {
            return this.dataService.data.getValue().competitions.sort(function (a, b) { return a.date - b.date; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompetitorsComponent.prototype, "descComps", {
        get: function () {
            return this.dataService.data.getValue().competitions.sort(function (a, b) { return b.date - a.date; });
        },
        enumerable: true,
        configurable: true
    });
    CompetitorsComponent.prototype.generateEventsPerStyle = function () {
        var _this = this;
        var projection = this.dataService.data.getValue().competitions
            .filter(function (c) { return c.date <= _this.dateEndFilter &&
            c.date >= _this.dateStartFilter; })
            .reduce(function (p, c) { return p.concat(c.dancedEvents
            .map(function (d) {
            d.date = c.date;
            return d;
        })); }, [])
            .reduce(function (p, d) {
            p[d.style] = (p[d.style] || { style: d.style, dances: [] });
            p[d.style].dances.push(d);
            return p;
        }, {});
        this.perStyles = Object.values(projection);
    };
    CompetitorsComponent.prototype.generateEventsPerDance = function () {
        var _this = this;
        var projection = this.dataService.data.getValue().competitions
            .filter(function (c) { return c.date <= _this.dateEndFilter &&
            c.date >= _this.dateStartFilter; })
            .reduce(function (p, c) { return p.concat(c.dancedEvents
            .map(function (d) {
            d.date = c.date;
            return d;
        })); }, [])
            .reduce(function (p, d) {
            for (var i = 0; i < d.dances.length; i++) {
                var key = d.style + ':' + d.dances[i];
                p[key] = (p[key] || { style: d.style, dance: d.dances[i], dances: [] });
                p[key].dances.push(d);
            }
            return p;
        }, {});
        this.perDance = Object.values(projection);
    };
    CompetitorsComponent.prototype.setPotentialRole = function () {
        var me = this.dataService.data.getValue().dancerName;
        var placements = this.dataService.data.getValue()
            .competitions.map(function (c) { return c.dancedEvents
            .map(function (d) { return DanceEvent_1.DanceEvent.getPlacement(d, me); }); }).reduce(function (p, c) { return p.concat(c); }, []);
        var role = null;
        for (var i = 0; i < placements.length; i++) {
            if (Dancer_1.Dancer.equals(placements[i].follower, me)) {
                if (role === null) {
                    role = RoleType_1.RoleType.Follow;
                }
                else {
                    role = role === RoleType_1.RoleType.Follow ? role : RoleType_1.RoleType.Mixed;
                }
            }
            else if (Dancer_1.Dancer.equals(placements[i].leader, me)) {
                if (role === null) {
                    role = RoleType_1.RoleType.Lead;
                }
                else {
                    role = role === RoleType_1.RoleType.Lead ? role : RoleType_1.RoleType.Mixed;
                }
            }
            if (role === RoleType_1.RoleType.Mixed) {
                break;
            }
        }
        this.roleFilter = role;
    };
    CompetitorsComponent.prototype.generateAllDance = function () {
        var _this = this;
        this.allDance = this.dataService.data.getValue().competitions
            .filter(function (c) { return c.date <= _this.dateEndFilter &&
            c.date >= _this.dateStartFilter; })
            .reduce(function (p, c) { return p.concat(c.dancedEvents.map(function (d) {
            d.date = c.date;
            return d;
        })); }, []);
    };
    CompetitorsComponent = __decorate([
        core_1.Component({
            selector: 'app-competitors-component',
            templateUrl: './competitors.component.html',
            styleUrls: ['./competitors.component.scss'],
        }),
        __metadata("design:paramtypes", [data_service_1.DataService])
    ], CompetitorsComponent);
    return CompetitorsComponent;
}());
exports.CompetitorsComponent = CompetitorsComponent;
//# sourceMappingURL=competitors.component.js.map