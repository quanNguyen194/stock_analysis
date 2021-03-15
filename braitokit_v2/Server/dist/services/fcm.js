"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
/**
 * Fcm
 */
class Fcm {
    /**
     * constructor
     */
    constructor() {
        if (Fcm._instance != null) {
            throw new Error("Error: Can't instance a singleton");
        }
    }
    /**
     * instance
     * @returns Fcm
     */
    static get instance() {
        return Fcm._instance;
    }
    /**
     * sendToTopic
     * @param params
     * @returns Promise<void>
     */
    sendToTopic(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let topicCondition = params.topic;
            if (params.topic.length) {
                topicCondition = `'${params.topic.join("' in topics || '")}' in topics`;
            }
            console.log("Send FCM to topic: ", topicCondition);
            try {
                const res = yield firebase_admin_1.default.messaging().send({
                    condition: topicCondition,
                    notification: params.notification
                });
                console.info("Send FCM Successfully:", res);
            }
            catch (e) {
                console.error("Send FCM Failure: ", e);
            }
        });
    }
}
exports.default = Fcm;
Fcm._instance = new Fcm();
//# sourceMappingURL=fcm.js.map