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
const verify_1 = require("../../verify");
const db_1 = require("../../../../db");
const router = new Router();
exports.router = router;
const PREFIX = '/api/chat';
router.post(`${PREFIX}/newconversation`, verify_1.verify, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = ctx.state;
    const { identity, personality } = ctx.request.body;
    if (!identity || !personality) {
        ctx.status = 400;
        ctx.body = {
            message: 'Have no profile info.'
        };
        return;
    }
    const identityPrompt = `You are ${identity}.`;
    const personalityPrompt = `Your personality is ${personality}.`;
    const avatar = `${identityPrompt}\n${personalityPrompt}`;
    try {
        const [result] = yield db_1.db.query('INSERT INTO chat_windows (user_id, avatar) VALUES (?, ?)', [userId, avatar]);
        ctx.status = 200;
        ctx.body = {
            id: result.insertId,
            message: 'window created'
        };
    }
    catch (error) {
        console.log('error', error);
        ctx.status = 500;
        ctx.body = 'Error on the server.';
    }
}));
