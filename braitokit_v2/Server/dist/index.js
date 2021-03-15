"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const database_1 = __importDefault(require("./driver/database"));
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
// import admin from "firebase-admin";
const socket_1 = __importDefault(require("./services/socket"));
const auth_1 = require("./controllers/app/auth");
dotenv_1.default.config();
const app = express_1.default();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const server = new http_1.default.Server(app);
const io = socket_io_1.default(server);
const port = process.env.PORT || 8000;
// connect db
database_1.default.connect().then(() => console.log("Connected to DB ============="));
// init firebase admin
// admin.initializeApp({
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   credential: admin.credential.cert(require("../mcaio-c5bgz-b1c52dba02.json")),
//   databaseURL: "https://mcaio-project.firebaseio.com"
// });
// init app socket and listen app events
socket_1.default.initialize(io);
// Set cross origin
app.use(cors({ origin: true, credentials: true }));
// file upload
app.use(fileUpload({
    createParentPath: true
}));
// for parsing application/json
app.use(body_parser_1.default.json());
app.use("/uploads/avatars", express_1.default.static("./uploads/avatars"));
// for parsing application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
// auth route
const authRouter = express_1.default.Router();
const authController = new auth_1.AuthController();
authRouter.post("/api/login", authController.login);
authRouter.post("/api/forgot-pwd", authController.forgotPassword);
authRouter.post("/api/reset-pwd", authController.resetPassword);
app.use("/", authRouter);
app.use("/admin/api", routes_1.default.adminApiRoutes);
app.use("/api", routes_1.default.appApiRoutes);
app.use("/", routes_1.default.webRoutes);
server.listen(port, () => console.log(`App listening on http://localhost:${port}`));
//# sourceMappingURL=index.js.map