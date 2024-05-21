"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./routes/user"));
const chat_1 = require("./routes/chat");
const http_1 = __importDefault(require("http"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || '';
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173'],
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
}));
// Session middleware
const sessionMiddleware = (0, express_session_1.default)({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax'
    }
});
app.use(sessionMiddleware);
app.use("/api/v1/user", user_1.default);
app.use("/api/v1/chat", chat_1.chatRouter);
// Session verify route
app.get('/api/v1/session', (req, res) => {
    if (req.session.user) {
        res.json({
            isAuthenticated: true,
            user: req.session.user
        });
    }
    else {
        res.status(401).json({
            isAuthenticated: false
        });
    }
});
const server = http_1.default.createServer(app);
// WebSocket upgrade handling with session middleware
server.on("upgrade", (request, socket, head) => {
    sessionMiddleware(request, {}, () => {
        if (!request.session.user) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }
        chat_1.wss.handleUpgrade(request, socket, head, (ws) => {
            chat_1.wss.emit('connection', ws, request);
        });
    });
});
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
