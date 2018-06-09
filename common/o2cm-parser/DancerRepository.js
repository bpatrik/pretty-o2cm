"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dancer_1 = require("./entities/Dancer");
var DancerRepository = /** @class */ (function () {
    function DancerRepository() {
        this.dancers = [];
    }
    Object.defineProperty(DancerRepository, "Instance", {
        get: function () {
            if (this.instance == null) {
                this.instance = new DancerRepository();
            }
            return this.instance;
        },
        enumerable: true,
        configurable: true
    });
    DancerRepository.prototype.createOrGet = function (name) {
        var n = Dancer_1.Dancer.getName(name);
        for (var i = 0; i < this.dancers.length; i++) {
            if (this.dancers[i].equals(n)) {
                return this.dancers[i];
            }
        }
        this.dancers.push(new Dancer_1.Dancer(name));
        return this.dancers[this.dancers.length - 1];
    };
    DancerRepository.instance = null;
    return DancerRepository;
}());
exports.DancerRepository = DancerRepository;
//# sourceMappingURL=DancerRepository.js.map