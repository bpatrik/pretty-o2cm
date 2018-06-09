"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DancerRepository_1 = require("../DancerRepository");
var Individual = /** @class */ (function () {
    function Individual(firstName, lastName, competitions) {
        this.dancer = DancerRepository_1.DancerRepository.Instance.createOrGet(firstName + ' ' + lastName);
        this.competitions = competitions;
    }
    Object.defineProperty(Individual.prototype, "Competitions", {
        get: function () {
            return this.competitions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Individual.prototype, "Skills", {
        get: function () {
            var skills = {};
            var events = [];
            this.competitions.forEach(function (c) { return events = events.concat(c.dancedEvents); });
            for (var i = 0; i < events.length; i++) {
                skills[events[i].pointSkill] = skills[events[i].pointSkill] || [];
                skills[events[i].pointSkill].push(events[i]);
            }
            return skills;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Individual.prototype, "Styles", {
        get: function () {
            var skills = {};
            var events = [];
            this.competitions.forEach(function (c) { return events = events.concat(c.dancedEvents); });
            for (var i = 0; i < events.length; i++) {
                skills[events[i].style] = skills[events[i].style] || [];
                skills[events[i].style].push(events[i]);
            }
            return skills;
        },
        enumerable: true,
        configurable: true
    });
    return Individual;
}());
exports.Individual = Individual;
//# sourceMappingURL=Individual.js.map