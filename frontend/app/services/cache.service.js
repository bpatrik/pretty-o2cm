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
var data_loader_service_1 = require("./data-loader.service");
var CacheService = /** @class */ (function () {
    function CacheService() {
        this.ready = true;
        var version = localStorage.getItem(CacheService_1.KEY_VERSION);
        this.cacheList = JSON.parse(localStorage.getItem(CacheService_1.KEY_LIST));
        if (version !== data_loader_service_1.DataParserService.VERSION || !this.cacheList) {
            this.reset();
        }
    }
    CacheService_1 = CacheService;
    CacheService.prototype.reset = function () {
        try {
            localStorage.clear();
            this.cacheList = [];
            localStorage.setItem(CacheService_1.KEY_VERSION, data_loader_service_1.DataParserService.VERSION);
            localStorage.setItem(CacheService_1.KEY_LIST, JSON.stringify(this.cacheList));
        }
        catch (err) {
            this.ready = false;
        }
    };
    CacheService.prototype.get = function (dancerName) {
        if (this.ready === false) {
            return null;
        }
        try {
            var key = CacheService_1.KEY_PREFIX + dancerName.firstName.toLowerCase() + '' + dancerName.lastName.toLowerCase();
            return JSON.parse(localStorage.getItem(key));
        }
        catch (err) {
        }
        return null;
    };
    CacheService.prototype.put = function (data) {
        if (this.ready === false) {
            return;
        }
        try {
            var key = CacheService_1.KEY_PREFIX + data.dancerName.firstName.toLowerCase() + '' + data.dancerName.lastName.toLowerCase();
            if (this.cacheList.indexOf(key) !== -1) {
                this.cacheList.splice(this.cacheList.indexOf(key), 1);
            }
            this.cacheList.push(key);
            if (this.cacheList.length >= 10) {
                localStorage.removeItem(this.cacheList.shift());
            }
            localStorage.setItem(key, JSON.stringify(data));
            localStorage.setItem(CacheService_1.KEY_LIST, JSON.stringify(this.cacheList));
        }
        catch (err) {
            this.reset();
        }
    };
    CacheService.KEY_PREFIX = 'dancer:';
    CacheService.KEY_VERSION = 'version';
    CacheService.KEY_LIST = 'list';
    CacheService = CacheService_1 = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], CacheService);
    return CacheService;
    var CacheService_1;
}());
exports.CacheService = CacheService;
//# sourceMappingURL=cache.service.js.map