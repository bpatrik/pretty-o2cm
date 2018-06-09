"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dancer = /** @class */ (function () {
    function Dancer(name) {
        this.name = name;
        var n = Dancer.getName(name);
        this.firstName = n.firstName;
        this.lastName = n.lastName;
    }
    Dancer.isTBA = function (dancer) {
        return dancer.firstName.toLowerCase() === 'tba' && dancer.lastName.toLowerCase() === 'tba' ||
            dancer.firstName.toLowerCase() === '---' && dancer.lastName.toLowerCase() === 'tba' ||
            dancer.firstName.toLowerCase() === 'tbd' && dancer.lastName.toLowerCase() === 'tbd';
    };
    Dancer.getName = function (name) {
        name = name.trim();
        var space = name.indexOf(' ');
        var firstName = name;
        var lastName = '';
        if (space !== -1) {
            firstName = name.substring(0, space).trim();
            lastName = name.substring(space).trim();
        }
        return {
            firstName: firstName,
            lastName: lastName
        };
    };
    Dancer.toKey = function (dancer) {
        return dancer.firstName + '_' + dancer.lastName;
    };
    Dancer.equals = function (that, other) {
        return (that && other && that.firstName.toLowerCase() === other.firstName.toLowerCase()
            && that.lastName.toLowerCase() === other.lastName.toLowerCase()) || (that === other);
    };
    Dancer.compare = function (that, other) {
        if (that.lastName < other.lastName) {
            return -1;
        }
        if (that.lastName > other.lastName) {
            return 1;
        }
        if (that.firstName < other.firstName) {
            return -1;
        }
        if (that.firstName > other.firstName) {
            return 1;
        }
        return 0;
    };
    Dancer.prototype.equals = function (other) {
        return Dancer.equals(this, other);
    };
    Dancer.prototype.toJSONable = function () {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            studio: this.studio
        };
    };
    return Dancer;
}());
exports.Dancer = Dancer;
//# sourceMappingURL=Dancer.js.map