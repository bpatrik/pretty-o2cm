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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var Types_1 = require("../../../common/o2cm-parser/entities/Types");
var IndividualParser_1 = require("../../../common/o2cm-parser/IndividualParser");
var http_1 = require("@angular/common/http");
var Competition_1 = require("../../../common/o2cm-parser/entities/Competition");
var ng2_slim_loading_bar_1 = require("ng2-slim-loading-bar");
var router_1 = require("@angular/router");
var DanceEvent_1 = require("../../../common/o2cm-parser/entities/DanceEvent");
var cache_service_1 = require("./cache.service");
var data_loader_service_1 = require("./data-loader.service");
var QueryParams_1 = require("../QueryParams");
var DataService = /** @class */ (function () {
    function DataService(http, router, route, slimLoadingBarService, cacheService, dataParser) {
        var _this = this;
        this.http = http;
        this.router = router;
        this.route = route;
        this.slimLoadingBarService = slimLoadingBarService;
        this.cacheService = cacheService;
        this.dataParser = dataParser;
        this.queryParams = {};
        this.proxyHTTP = {
            post: function (url, body) {
                return _this.http.get('/proxy/' + encodeURIComponent(url), {
                    params: {
                        body: body
                    },
                    responseType: 'text'
                }).toPromise();
            }
        };
        this.data = new rxjs_1.BehaviorSubject({
            dancerName: {
                firstName: '',
                lastName: ''
            }, summary: {},
            competitions: []
        });
        this.loading = new rxjs_1.BehaviorSubject(null);
        route.queryParams.subscribe(function (value) {
            if (value[QueryParams_1.QueryParams.name.firstName] && value[QueryParams_1.QueryParams.name.lastName] &&
                value[QueryParams_1.QueryParams.name.firstName] !== _this.data.getValue().dancerName.firstName &&
                value[QueryParams_1.QueryParams.name.lastName] !== _this.data.getValue().dancerName.lastName) {
                _this.loadDancer(value[QueryParams_1.QueryParams.name.firstName], value[QueryParams_1.QueryParams.name.lastName]);
            }
            _this.queryParams[QueryParams_1.QueryParams.heatid] = value[QueryParams_1.QueryParams.heatid];
            _this.queryParams[QueryParams_1.QueryParams.compCode] = value[QueryParams_1.QueryParams.compCode];
            _this.queryParams[QueryParams_1.QueryParams.competitor.lastName] = value[QueryParams_1.QueryParams.competitor.lastName];
            _this.queryParams[QueryParams_1.QueryParams.competitor.firstName] = value[QueryParams_1.QueryParams.competitor.firstName];
        });
        this.data.subscribe(function (value) {
            if (value.dancerName.firstName === '' || value.dancerName.lastName === '') {
                return;
            }
            var queryParams = _this.queryParams;
            queryParams[QueryParams_1.QueryParams.name.firstName] = value.dancerName.firstName;
            queryParams[QueryParams_1.QueryParams.name.lastName] = value.dancerName.lastName;
            _this.router.navigate([], {
                queryParams: queryParams
            });
        });
        // this.loadData();
        // this.loadDummy();
    }
    DataService.prototype.loadDummy = function () {
        var comp = new Competition_1.Competition(new IndividualParser_1.CompetitionCore('BU comp'));
        comp.date = Date.now();
        comp.dancedEvents = [
            new DanceEvent_1.DanceEvent('A dance', 'na', Types_1.DivisionTypes.Amateur, Types_1.AgeTypes.Adult, {
                type: Types_1.EventSkillTypes.Bronze,
                str: ''
            }, Types_1.StyleTypes.Smooth, [Types_1.DanceTypes.Waltz])
        ];
        this.data.next({
            dancerName: { firstName: 'Patrik', lastName: 'Braun' },
            summary: {
                Latin: {
                    style: Types_1.StyleTypes.Latin,
                    dances: [{
                            dance: Types_1.DanceTypes.Rumba,
                            entries: [{
                                    pointSkill: Types_1.PointSkillTypes.Newcomer,
                                    startTime: Date.now(),
                                    lastCompetition: Date.now(),
                                    points: { overall: 2, details: [] }
                                }, {
                                    pointSkill: Types_1.PointSkillTypes.Bronze,
                                    startTime: Date.now(),
                                    lastCompetition: Date.now() - 1000,
                                    points: { overall: 2, details: [] }
                                }]
                        },
                        {
                            dance: Types_1.DanceTypes.ChaCha,
                            entries: [{
                                    pointSkill: Types_1.PointSkillTypes.Silver,
                                    startTime: Date.now(),
                                    lastCompetition: Date.now() - 1000,
                                    points: { overall: 2, details: [] }
                                }, {
                                    pointSkill: Types_1.PointSkillTypes.Bronze,
                                    startTime: Date.now(),
                                    lastCompetition: Date.now(),
                                    points: { overall: 2, details: [] }
                                }]
                        }
                    ]
                }
            }, competitions: [comp
            ]
        });
    };
    DataService.prototype.loadDancer = function (fistName, lastName) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var name, cache, person, partialData, person, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.slimLoadingBarService.visible = true;
                        this.slimLoadingBarService.start(function () {
                            _this.slimLoadingBarService.visible = false;
                        });
                        name = {
                            firstName: fistName,
                            lastName: lastName
                        };
                        cache = this.cacheService.get(name);
                        if (!cache) return [3 /*break*/, 2];
                        this.data.next(cache);
                        return [4 /*yield*/, IndividualParser_1.IndividualParser.parse(name, this.proxyHTTP, function (loading) {
                                if (loading.maximum) {
                                    _this.loading.next(loading);
                                }
                            }, cache.competitions)];
                    case 1:
                        person = _a.sent();
                        partialData = this.dataParser.parseDancer(person);
                        this.data.next(this.dataParser.mergeDate(cache, partialData));
                        this.cacheService.put(this.data.getValue());
                        this.loading.next(null);
                        this.slimLoadingBarService.complete();
                        return [2 /*return*/];
                    case 2:
                        this.data.next({
                            dancerName: name,
                            summary: {},
                            competitions: []
                        });
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, IndividualParser_1.IndividualParser.parse(name, this.proxyHTTP, function (loading) {
                                _this.loading.next(loading);
                            })];
                    case 4:
                        person = _a.sent();
                        this.data.next(this.dataParser.parseDancer(person));
                        this.cacheService.put(this.data.getValue());
                        this.slimLoadingBarService.complete();
                        this.loading.next(null);
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DataService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient,
            router_1.Router,
            router_1.ActivatedRoute,
            ng2_slim_loading_bar_1.SlimLoadingBarService,
            cache_service_1.CacheService,
            data_loader_service_1.DataParserService])
    ], DataService);
    return DataService;
}());
exports.DataService = DataService;
//# sourceMappingURL=data.service.js.map