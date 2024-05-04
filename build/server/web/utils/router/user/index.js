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
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const Router = require("koa-router");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db_1 = require("../../db");
const jwt_1 = require("../../../../const/jwt");
const router = new Router();
exports.router = router;
const PREFIX = '/api/user';
router.post(`${PREFIX}/register`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = ctx.request.body;
    if (!username || !password) {
        ctx.status = 400;
        ctx.body = { message: 'have no username or password.' };
        return;
    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    try {
        yield db_1.db.query('INSERT INTO user (username, password) VALUES (?, ?)', [username, hashedPassword]);
        ctx.status = 201;
        ctx.body = { message: 'User created' };
    }
    catch (error) {
        ctx.status = 500;
        ctx.body = 'Error on the server.';
    }
}));
router.post(`${PREFIX}/login`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = ctx.request.body;
    if (!username || !password) {
        ctx.status = 400;
        ctx.body = { message: 'have no username or password.' };
        return;
    }
    try {
        const [results] = yield db_1.db.query('SELECT * FROM user WHERE username = ?', [username]);
        console.log('results', results);
        if (results.length === 0) {
            ctx.status = 404;
            ctx.body = 'No user found.';
            return;
        }
        const user = results[0];
        if (!user) {
            throw 'Error on the server.';
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            ctx.status = 401;
            ctx.body = { message: 'username or password wrong.' };
            return;
        }
        const token = jwt.sign({ id: user.id }, jwt_1.JWT_SECRET, {
            expiresIn: 86400000 // 24 * 1000 hours
        });
        ctx.status = 200;
        ctx.body = { auth: true, token: token };
    }
    catch (error) {
        ctx.status = 500;
        ctx.body = 'Error on the server.';
    }
}));
