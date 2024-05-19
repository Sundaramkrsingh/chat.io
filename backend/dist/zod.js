"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinInput = exports.signupInput = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupInput = zod_1.default.object({
    username: zod_1.default.string()
        .min(8, { message: "username must contain 8 characters" })
        .max(15, { message: "username must not exceed 15 characters" }),
    email: zod_1.default.string().email(),
    password: zod_1.default.string()
        .min(8, { message: "Password must contain 8 characters" })
        .max(50, { message: "Password must not exceed 50 characters" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, { message: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character" })
});
exports.signinInput = zod_1.default.object({
    email: zod_1.default.union([zod_1.default.string().email(), zod_1.default.string()]),
    password: zod_1.default.string()
});
