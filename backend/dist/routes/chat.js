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
exports.wss = exports.chatRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const prisma = new client_1.PrismaClient();
const wss = new ws_1.WebSocketServer({ noServer: true });
exports.wss = wss;
const chatRouter = (0, express_1.default)();
exports.chatRouter = chatRouter;
// session check middleware
chatRouter.use('/', (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    }
    else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});
// route to fetch all messages 
chatRouter.get("/messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield prisma.message.findMany({
            select: {
                username: true,
                text: true,
                timeStamp: true
            }
        });
        res.json({
            messages
        });
    }
    catch (err) {
        console.log("Error while fetching messages", err);
        res.status(411).json({
            msg: "Error while fetching messages"
        });
    }
}));
// websokcet logic
wss.on("connection", (ws, request) => {
    var _a;
    const user = (_a = request.session) === null || _a === void 0 ? void 0 : _a.user;
    console.log(`New WebSocket connection from user: ${user === null || user === void 0 ? void 0 : user.username}`);
    ws.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
        let receivedMessage = { username: "", text: "", timeStamp: "" };
        try {
            receivedMessage = JSON.parse(message);
        }
        catch (err) {
            console.log("Failed to parse the received message", err);
        }
        console.log(`Received message: ${receivedMessage.text}`);
        // storing in db
        try {
            yield prisma.message.create({
                data: {
                    username: receivedMessage.username,
                    text: receivedMessage.text,
                    timeStamp: receivedMessage.timeStamp
                }
            });
        }
        catch (err) {
            console.log("user not found", err);
        }
        // Broadcast the message to all clients
        const broadcastMessage = JSON.stringify(receivedMessage);
        wss.clients.forEach(client => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(broadcastMessage);
            }
        });
    }));
    ws.on("close", () => {
        console.log(`WebSocket connection closed for user: ${user === null || user === void 0 ? void 0 : user.username}`);
    });
});
