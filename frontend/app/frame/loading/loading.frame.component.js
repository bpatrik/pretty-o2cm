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
var LoadingFrameComponent = /** @class */ (function () {
    function LoadingFrameComponent() {
    }
    LoadingFrameComponent.prototype.percent = function () {
        return Math.round(this.loading.current / this.loading.maximum * 100);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], LoadingFrameComponent.prototype, "loading", void 0);
    LoadingFrameComponent = __decorate([
        core_1.Component({
            selector: 'app-loading-fame-component',
            templateUrl: './loading.frame.component.html',
            styleUrls: ['./loading.frame.component.scss'],
        })
    ], LoadingFrameComponent);
    return LoadingFrameComponent;
}());
exports.LoadingFrameComponent = LoadingFrameComponent;
//# sourceMappingURL=loading.frame.component.js.map