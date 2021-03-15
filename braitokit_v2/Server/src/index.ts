import express from "express";
import bodyParser from "body-parser";
import database from "@/driver/database";
import routers from "@/routes";
import dotenv from "dotenv";
import http from "http";
import socketio from "socket.io";

// import admin from "firebase-admin";
import AppSocket from "@/services/socket";
import {AuthController} from "@/controllers/app/auth";

dotenv.config();

const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const server = new http.Server(app);
const io = socketio(server);
const port = process.env.PORT || 8000;

// connect db
database.connect().then(() => console.log("Connected to DB ============="));

// init firebase admin
// admin.initializeApp({
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   credential: admin.credential.cert(require("../mcaio-c5bgz-b1c52dba02.json")),
//   databaseURL: "https://mcaio-project.firebaseio.com"
// });

// init app socket and listen app events
AppSocket.initialize(io);

// Set cross origin
app.use(cors({origin:true,credentials: true}));

// file upload
app.use(fileUpload({
  createParentPath: true
}));

// for parsing application/json
app.use(bodyParser.json());

app.use("/uploads/avatars", express.static("./uploads/avatars"));

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true,
}));

// auth route
const authRouter = express.Router();
const authController = new AuthController();
authRouter.post("/api/login", authController.login);
authRouter.post("/api/forgot-pwd", authController.forgotPassword);
authRouter.post("/api/reset-pwd", authController.resetPassword);

app.use("/", authRouter);
app.use("/admin/api", routers.adminApiRoutes);
app.use("/api", routers.appApiRoutes);
app.use("/", routers.webRoutes);

server.listen(port, () => console.log(`App listening on http://localhost:${port}`));
