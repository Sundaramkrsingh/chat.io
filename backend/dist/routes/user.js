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
const express_1 = __importDefault(require("express"));
const zod_1 = require("../zod");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRouter = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
// signup route
userRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validating inputs
        const body = req.body;
        const validate = zod_1.signupInput.safeParse(body);
        if (!validate.success) {
            res.status(411);
            return res.json({
                msg: "Invalid inputs"
            });
        }
        // checking for similar email in db
        const existing = yield prisma.user.findFirst({
            where: { email: body.email }
        });
        if (existing) {
            return res.status(411).json({
                msg: "User with this email already exists"
            });
        }
        // hashing password and making entry of user in db
        const hashedPassword = yield bcrypt_1.default.hash(body.password, 10);
        const user = yield prisma.user.create({
            data: {
                username: body.username,
                email: body.email,
                password: hashedPassword
            }
        });
        // inserting user details in session
        req.session.user = {
            username: user.username,
            email: user.email,
        };
        res.status(200);
        return res.json({
            signup: true,
            user: {
                email: user.email,
                username: user.username
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({
            msg: "Error while Signing up"
        });
    }
}));
// signin route 
userRouter.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validating inputs
        const body = req.body;
        const validate = zod_1.signinInput.safeParse(body);
        if (!validate.success) {
            res.status(411);
            return res.json({
                msg: "Invalid Inputs"
            });
        }
        // fetching user details from db
        const user = yield prisma.user.findFirst({
            where: {
                OR: [
                    { email: body.email },
                    { username: body.email }
                ]
            }
        });
        if (!user) {
            res.status(403);
            return res.json({
                msg: "User with this email does not exist"
            });
        }
        // verifying password
        const passwordValidation = yield bcrypt_1.default.compare(body.password, user.password);
        if (!passwordValidation) {
            return res.status(403).json({
                msg: "Incorrect password"
            });
        }
        // inserting user details in session
        req.session.user = {
            username: user.username,
            email: user.email
        };
        return res.status(200).json({
            signin: true,
            user: {
                email: user.email,
                username: user.username
            }
        });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({
            msg: "Error while Singning in"
        });
    }
}));
// signout route
userRouter.get('/signout', (req, res) => {
    res.clearCookie('connect.sid', { path: '/' });
    return res.json({
        signout: true
    });
});
exports.default = userRouter;
