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
var router_1 = require("@angular/router");
var data_service_1 = require("../services/data.service");
var FrameComponent = /** @class */ (function () {
    function FrameComponent(dataService) {
        this.dataService = dataService;
        this.firstName = '';
        this.lastName = '';
        this.isCollapsed = true;
        this.firstName = this.dataService.data.getValue().dancerName.firstName;
        this.lastName = this.dataService.data.getValue().dancerName.lastName;
    }
    FrameComponent.prototype.toggleCollapse = function () {
        this.isCollapsed = !this.isCollapsed;
    };
    FrameComponent.prototype.load = function () {
        if (this.firstName.trim() === '' && this.lastName.trim() === '') {
            return;
        }
        this.dataService.loadDancer(this.firstName, this.lastName);
    };
    FrameComponent = __decorate([
        core_1.Component({
            selector: 'app-frame',
            templateUrl: './frame.component.html',
            styleUrls: ['./frame.component.css'],
            providers: [router_1.RouterLink],
            encapsulation: core_1.ViewEncapsulation.Emulated
        }),
        __metadata("design:paramtypes", [data_service_1.DataService])
    ], FrameComponent);
    return FrameComponent;
}());
exports.FrameComponent = FrameComponent;
//# sourceMappingURL=frame.component.js.map