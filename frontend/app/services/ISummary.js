"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("../../../common/o2cm-parser/entities/Types");
var ISummary;
(function (ISummary) {
    ISummary.findPointSummary = function (that, event) {
        var ssum = null;
        if (event.style === Types_1.StyleTypes.Latin) {
            ssum = that.Latin;
        }
        if (event.style === Types_1.StyleTypes.Rhythm) {
            ssum = that.Rhythm;
        }
        if (event.style === Types_1.StyleTypes.Smooth) {
            ssum = that.Smooth;
        }
        if (event.style === Types_1.StyleTypes.Standard) {
            ssum = that.Standard;
        }
        if (!ssum) {
            return [];
        }
        var points = [];
        for (var i = 0; i < ssum.dances.length; i++) {
            for (var j = 0; j < event.dances.length; j++) {
                if (ssum.dances[i].dance === event.dances[j]) {
                    for (var k = 0; k < ssum.dances[i].entries.length; k++) {
                        if (ssum.dances[i].entries[k].pointSkill === event.pointSkill) {
                            points.push(ssum.dances[i].entries[k]);
                        }
                    }
                }
            }
        }
        return points;
    };
})(ISummary = exports.ISummary || (exports.ISummary = {}));
//# sourceMappingURL=ISummary.js.map