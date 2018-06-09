"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.enumToArray = function (EnumType) {
        var arr = [];
        for (var enumMember in EnumType) {
            if (!EnumType.hasOwnProperty(enumMember)) {
                continue;
            }
            var key = parseInt(enumMember, 10);
            if (key >= 0) {
                arr.push({ key: key, value: EnumType[enumMember] });
            }
        }
        return arr;
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map