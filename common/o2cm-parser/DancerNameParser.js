"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Placement_1 = require("./entities/Placement");
var DancerRepository_1 = require("./DancerRepository");
var PlacementParser = /** @class */ (function () {
    function PlacementParser() {
    }
    PlacementParser.parse = function (rawName) {
        /*  if (rawName.charAt(rawName.length - 4) === '-') {
            rawName = rawName.substring(0, rawName.length - 4);
          }*/
        var placement = null;
        var number = null;
        var names = [];
        if (rawName.indexOf(')') !== -1) {
            placement = parseInt(rawName.substring(0, rawName.indexOf(')')), 10);
            rawName = rawName.substring(rawName.indexOf(')') + 1);
        }
        var clone = rawName.trim();
        if (clone.indexOf(' ')) {
            clone = clone.substring(0, clone.indexOf(' '));
            if (!isNaN(clone[0]) && !isNaN(clone[clone.length - 1])) {
                number = parseInt(clone, 10);
                rawName = rawName.substring(rawName.trim().indexOf(' ') + 1);
            }
        }
        names = rawName.split('&');
        var plcmnt = new Placement_1.Placement(placement, number);
        if (names.length > 0) {
            plcmnt.Leader = DancerRepository_1.DancerRepository.Instance.createOrGet(names[0].trim());
        }
        if (names.length > 1) {
            var stateIndex = names[1].indexOf(' - ');
            var follow = names[1];
            if (stateIndex !== -1) {
                follow = names[1].substring(0, stateIndex);
                plcmnt.Follower = DancerRepository_1.DancerRepository.Instance.createOrGet(follow.trim());
            }
            var studioIndex = names[1].indexOf(' of ');
            if (studioIndex !== -1) {
                follow = names[1].substring(0, studioIndex);
                plcmnt.Follower = DancerRepository_1.DancerRepository.Instance.createOrGet(follow.trim());
                var studio = names[1].substring(studioIndex + 4).trim();
                plcmnt.follower.studio = studio;
                plcmnt.leader.studio = studio;
            }
        }
        return plcmnt;
    };
    return PlacementParser;
}());
exports.PlacementParser = PlacementParser;
//# sourceMappingURL=DancerNameParser.js.map