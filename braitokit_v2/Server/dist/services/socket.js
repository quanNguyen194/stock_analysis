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
const jwt_1 = __importDefault(require("../utils/jwt"));
const user_1 = __importDefault(require("../models/user"));
const socket_1 = __importDefault(require("../configs/socket"));
/**
 * Singleton AppSocket class
 */
class AppSocket {
    /**
     * constructor
     * @param io
     */
    constructor(io) {
        this._io = io;
        this._clients = new Map();
        AppSocket._instance = this;
    }
    /**
     * instance
     * @returns instance
     */
    static get instance() {
        if (AppSocket._instance == null) {
            throw new Error("Error: Must call AppSocket.initialize() first");
        }
        return AppSocket._instance;
    }
    /**
     * init singleton value
     * @param io
     * @returns AppSocket
     */
    static initialize(io) {
        const appSocket = new AppSocket(io);
        appSocket.initAppEvents();
        return appSocket;
    }
    /**
     * get clients
     * @returns Map<string, Map<string, socketio.Socket>>
     */
    get clients() {
        return this._clients;
    }
    /**
     * get socket IO
     * @returns socketio.Server
     */
    get io() {
        return this._io;
    }
    /**
     * listen app events: connect, disconnect, etc
     */
    initAppEvents() {
        this._io.sockets.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
            console.log("Checking token to access socket...");
            let deviceID = "";
            const { token } = socket.request.headers;
            if (!token) {
                socket.disconnect();
                return;
            }
            const decoded = yield jwt_1.default.parseToken(token);
            if (!decoded || !decoded.user) {
                socket.disconnect();
                return;
            }
            const currentUser = yield user_1.default.findOne({ _id: decoded.user._id });
            if (!currentUser) {
                socket.disconnect();
                return;
            }
            deviceID = socket.request.headers.device_id;
            if (!deviceID) {
                socket.disconnect();
                return;
            }
            socket.handshake.currentUser = currentUser;
            socket.handshake.deviceID = deviceID;
            setTimeout(() => {
                // sau 1s mà client vẫn chưa dc auth, lúc đấy chúng ta mới disconnect.
                if (!currentUser) {
                    console.log("Disconnecting socket ", socket.id);
                    socket.disconnect();
                }
            }, 1000);
            // initialize this client's sequence number
            let userConnectedDevices = new Map();
            // because _id is ObjectID so we need cast to string
            const userID = currentUser._id.toString();
            console.info(`Client connected [id=${socket.id}, user_id=${userID}]`);
            const currentUserConnected = this._clients.get(userID);
            if (currentUserConnected != null) {
                userConnectedDevices = this._clients.get(userID);
            }
            userConnectedDevices.set(deviceID, socket);
            this._clients.set(userID, userConnectedDevices);
            console.log("Connected clients: ", this._clients.size);
            this.listenClientEvents(socket, userID);
        }));
    }
    /**
     * listen client events
     * @param socket ..
     * @param userID ..
     */
    listenClientEvents(socket, userID) {
        // when socket disconnects, remove it from the list:
        socket.on("disconnect", () => {
            var _a, _b;
            userID = socket.handshake.currentUser._id.toString();
            (_a = this._clients.get(userID)) === null || _a === void 0 ? void 0 : _a.delete(socket.handshake.deviceID);
            if (!((_b = this._clients.get(userID)) === null || _b === void 0 ? void 0 : _b.size)) {
                this._clients.delete(userID);
            }
            console.info(`Client gone [id=${socket.id}]`);
            console.log("Connected clients: ", this._clients.size);
        });
        // join room
        socket.on(socket_1.default.events.CONVERSATION_JOIN, (event) => {
            socket.join(event.room_id);
        });
        // typing event
        socket.on(socket_1.default.events.CONVERSATION_TYPING, (event) => {
            this._io.in(event.room_id).emit(socket_1.default.events.CONVERSATION_TYPING, {
                user_id: userID,
                room_id: event.room_id
            });
        });
        // leave room
        socket.on(socket_1.default.events.CONVERSATION_LEAVE, (event) => {
            socket.leave(event.room_id);
        });
    }
    /**
     * emit to list of users
     * @param emitEvent ..
     * @returns string[]
     */
    emits(emitEvent) {
        const usersOffline = [];
        emitEvent.clientIds.forEach(id => {
            var _a;
            if (this._clients.has(id)) {
                (_a = this._clients.get(id)) === null || _a === void 0 ? void 0 : _a.forEach((socket) => {
                    socket.emit(emitEvent.event, emitEvent.data);
                });
            }
            else {
                usersOffline.push(id);
            }
        });
        return usersOffline;
    }
}
exports.default = AppSocket;
//# sourceMappingURL=socket.js.map