import socketio from "socket.io";
import jwt from "@/utils/jwt";
import userModel from "@/models/user";
import socketConfigs from "@/configs/socket";

interface IEmitEvent {
  clientIds: string[],
  event: string,
  data: any
}

/**
 * Singleton AppSocket class
 */
export default class AppSocket {

  private static _instance: AppSocket;
  private _io: socketio.Server;
  private _clients: Map<string, Map<string, socketio.Socket>>;

  /**
   * constructor
   * @param io
   */
  private constructor(io: socketio.Server) {
    this._io = io;
    this._clients = new Map();
    AppSocket._instance = this;
  }

  /**
   * instance
   * @returns instance
   */
  public static get instance(): AppSocket {
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
  public static initialize(io: socketio.Server): AppSocket {
    const appSocket = new AppSocket(io);
    appSocket.initAppEvents();
    return appSocket;
  }

  /**
   * get clients
   * @returns Map<string, Map<string, socketio.Socket>>
   */
  public get clients(): Map<string, Map<string, socketio.Socket>> {
    return this._clients;
  }


  /**
   * get socket IO
   * @returns socketio.Server
   */
  public get io(): socketio.Server {
    return this._io;
  }

  /**
   * listen app events: connect, disconnect, etc
   */
  public initAppEvents(): void {
    this._io.sockets.on("connection", async (socket) => {
      console.log("Checking token to access socket...");
      let deviceID = "";

      const { token } = socket.request.headers;
      if (!token) {
        socket.disconnect();
        return;
      }

      const decoded = await jwt.parseToken(token);
      if (!decoded || !decoded.user) {
        socket.disconnect();
        return;
      }

      const currentUser = await userModel.findOne({ _id: decoded.user._id });
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
      let userConnectedDevices = new Map<string, socketio.Socket>();
      // because _id is ObjectID so we need cast to string
      const userID = currentUser._id.toString();

      console.info(`Client connected [id=${socket.id}, user_id=${userID}]`);

      const currentUserConnected = this._clients.get(userID);
      if (currentUserConnected != null) {
        userConnectedDevices = this._clients.get(userID)!;
      }
      userConnectedDevices.set(deviceID, socket);
      this._clients.set(userID, userConnectedDevices);

      console.log("Connected clients: ", this._clients.size);

      this.listenClientEvents(socket, userID);
    });
  }

  /**
   * listen client events
   * @param socket ..
   * @param userID ..
   */
  private listenClientEvents(socket: socketio.Socket, userID: string) {
    // when socket disconnects, remove it from the list:
    socket.on("disconnect", () => {
      userID = socket.handshake.currentUser._id.toString();
      this._clients.get(userID)?.delete(socket.handshake.deviceID);
      if (!this._clients.get(userID)?.size) {
        this._clients.delete(userID);
      }

      console.info(`Client gone [id=${socket.id}]`);
      console.log("Connected clients: ", this._clients.size);
    });

    // join room
    socket.on(socketConfigs.events.CONVERSATION_JOIN, (event) => {
      socket.join(event.room_id);
    });

    // typing event
    socket.on(socketConfigs.events.CONVERSATION_TYPING, (event) => {
      this._io.in(event.room_id).emit(socketConfigs.events.CONVERSATION_TYPING, {
        user_id: userID,
        room_id: event.room_id
      });
    });

    // leave room
    socket.on(socketConfigs.events.CONVERSATION_LEAVE, (event) => {
      socket.leave(event.room_id);
    });
  }

  /**
   * emit to list of users
   * @param emitEvent ..
   * @returns string[]
   */
  public emits(emitEvent: IEmitEvent): string[] {
    const usersOffline: string[] = [];
    emitEvent.clientIds.forEach(id => {
      if(this._clients.has(id)) {
        this._clients.get(id)?.forEach((socket) => {
          socket.emit(emitEvent.event, emitEvent.data);
        });
      } else {
        usersOffline.push(id);
      }
    });
    return usersOffline;
  }

}
