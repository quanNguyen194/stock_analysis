"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareMD5String = exports.HashString = void 0;
const md5_1 = __importDefault(require("md5"));
/**
 * Hash string
 * @param str ..
 * @returns string
 */
const HashString = (str) => {
    if (!str)
        return "";
    return md5_1.default(str);
};
exports.HashString = HashString;
/**
 * Compare md5 string
 * @param str ..
 * @param md5Str ..
 * @returns boolean
 */
const CompareMD5String = (str, md5Str) => {
    if (!str)
        return false;
    if (md5_1.default(str) === md5Str)
        return true;
    return false;
};
exports.CompareMD5String = CompareMD5String;
//# sourceMappingURL=md5.js.map