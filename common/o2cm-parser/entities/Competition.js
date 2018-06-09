"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Competition = /** @class */ (function () {
    function Competition(core) {
        this.rawName = core.rawName;
        this.name = core.name;
        this.date = core.date;
        this.linkCode = core.linkCode;
    }
    Competition.shallowCopy = function (that) {
        return {
            rawName: that.rawName,
            name: that.name,
            date: that.date,
            linkCode: that.linkCode,
            dancedEvents: that.dancedEvents
        };
    };
    Object.defineProperty(Competition.prototype, "DanceEvents", {
        get: function () {
            return this.dancedEvents;
        },
        set: function (dancedEvents) {
            var _this = this;
            if (this.dancedEvents) {
                throw new Error('Dance events already set');
            }
            this.dancedEvents = dancedEvents;
            this.dancedEvents.forEach(function (d) {
                d.Competition = _this;
            });
        },
        enumerable: true,
        configurable: true
    });
    Competition.prototype.toJSONable = function () {
        return {
            rawName: this.rawName,
            name: this.name,
            date: this.date,
            linkCode: this.linkCode,
            dancedEvents: this.dancedEvents.map(function (e) { return e.toJSONable(); })
        };
    };
    return Competition;
}());
exports.Competition = Competition;
//# sourceMappingURL=Competition.js.map