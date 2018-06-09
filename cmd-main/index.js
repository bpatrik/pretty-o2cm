"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var HTTPLoader_1 = require("./HTTPLoader");
var RegistrationParser_1 = require("../common/o2cm-parser/RegistrationParser");
var model_1 = require("../backend/model");
var Dancer_1 = require("../common/o2cm-parser/entities/Dancer");
var ISummary_1 = require("../frontend/app/services/ISummary");
var Rules_1 = require("../frontend/app/services/Rules");
var run = function () { return __awaiter(_this, void 0, void 0, function () {
    var events, i, event_1, j, summary, ps, startTime, point, length_1, left, summary, ps, startTime, point, length_2, left, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                return [4 /*yield*/, RegistrationParser_1.RegistrationParser.parse('mit', HTTPLoader_1.HTTPLoader)];
            case 1:
                events = _a.sent();
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < events.length)) return [3 /*break*/, 9];
                event_1 = events[i];
                j = 0;
                _a.label = 3;
            case 3:
                if (!(j < event_1.placements.length)) return [3 /*break*/, 8];
                if (!!Dancer_1.Dancer.isTBA(event_1.placements[j].leader)) return [3 /*break*/, 5];
                return [4 /*yield*/, model_1.getSummary(event_1.placements[j].leader)];
            case 4:
                summary = _a.sent();
                ps = ISummary_1.ISummary.findPointSummary(summary, event_1);
                if (ps.length === 0) {
                    return [3 /*break*/, 7];
                }
                console.log(ps);
                startTime = ps.map(function (v) { return v.startTime; }).sort()[0];
                point = ps.map(function (v) { return v.points.overall; }).reverse()[0];
                length_1 = Rules_1.Rules.Timeout[event_1.pointSkill];
                left = (startTime + length_1) - Date.now();
                console.log(event_1.placements[j].leader.name, point, left < 0 ? 'timeout' : '');
                _a.label = 5;
            case 5:
                if (!!Dancer_1.Dancer.isTBA(event_1.placements[j].follower)) return [3 /*break*/, 7];
                return [4 /*yield*/, model_1.getSummary(event_1.placements[j].follower)];
            case 6:
                summary = _a.sent();
                ps = ISummary_1.ISummary.findPointSummary(summary, event_1);
                if (ps.length === 0) {
                    return [3 /*break*/, 7];
                }
                console.log(ps);
                startTime = ps.map(function (v) { return v.startTime; }).sort()[0];
                point = ps.map(function (v) { return v.points.overall; }).reverse()[0];
                length_2 = Rules_1.Rules.Timeout[event_1.pointSkill];
                left = (startTime + length_2) - Date.now();
                console.log(event_1.placements[j].follower.name, point, left < 0 ? 'timeout' : '');
                _a.label = 7;
            case 7:
                j++;
                return [3 /*break*/, 3];
            case 8:
                i++;
                return [3 /*break*/, 2];
            case 9: return [3 /*break*/, 11];
            case 10:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
run();
//# sourceMappingURL=index.js.map