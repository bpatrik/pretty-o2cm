"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dancer_1 = require("./Dancer");
var Placement = /** @class */ (function () {
    function Placement(placement, leaderNumber) {
        this.placement = placement;
        this.leaderNumber = leaderNumber;
    }
    Placement.hasDancer = function (that, other) {
        return (that.leader && Dancer_1.Dancer.equals(that.leader, other)) ||
            (that.follower && Dancer_1.Dancer.equals(that.follower, other));
    };
    Placement.getPartner = function (that, dancer) {
        if (Dancer_1.Dancer.equals(that.leader, dancer)) {
            return that.follower || Dancer_1.Dancer.getName('Unknown Partner');
        }
        else {
            return that.leader || Dancer_1.Dancer.getName('Unknown Partner');
        }
    };
    Object.defineProperty(Placement.prototype, "Leader", {
        set: function (dancer) {
            this.leader = dancer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Placement.prototype, "Follower", {
        set: function (dancer) {
            this.follower = dancer;
        },
        enumerable: true,
        configurable: true
    });
    Placement.prototype.setEvent = function (event) {
        if (this.event) {
            throw new Error('event already set');
        }
        this.event = event;
        this.event.addPlacement(this);
    };
    Placement.prototype.hasDancer = function (dancer) {
        return Placement.hasDancer(this, dancer);
    };
    Placement.prototype.toJSONable = function () {
        return {
            leader: this.leader ? this.leader.toJSONable() : null,
            follower: this.follower ? this.follower.toJSONable() : null,
            placement: this.placement,
            leaderNumber: this.leaderNumber,
            isFinal: this.isFinal
        };
    };
    return Placement;
}());
exports.Placement = Placement;
//# sourceMappingURL=Placement.js.map