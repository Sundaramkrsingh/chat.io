"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatRouter = (0, express_1.default)();
// authentication middleware 
chatRouter.use('/', (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    }
    else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});
exports.default = chatRouter;
