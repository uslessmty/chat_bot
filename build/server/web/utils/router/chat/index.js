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
const llm_1 = require("../../../../llm");
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
    const identityPrompt = `Your identity is ${identity}.`;
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
const getSystemPrompt = (avatar) => {
    return `${avatar}
Your response should obey requirement as bellow:
1. You should only respond in JSON format as described below.
\`\`\`
{
    "emotions": "your current emotion.",
    "word": "the words that you say to user.",
    "action": "your current action."
}
\`\`\`
2. Your emotion should be picked from array as blow.
\`\`\`
["happy", "sad", "angry", "amazed", "peaceful", "fearful"]
\`\`\`
3. Your action should be picked from array as blow.
\`\`\`
[
    {
        type: "sit down"
    },
    {
        type: "stand up"
    },
    {
        type: "stop"
    },
    {
        type: "walk",
        context: {
            destination: "the place where you want to go",
        }
    },
    {
        type: "run",
        context: {
            destination: "the place where you want to go",
        }
    }
]
\`\`\`
4. If your action has context, your response should supplement it.
5. Your word must be Chinese.
`;
};
router.post(`${PREFIX}/dialog`, verify_1.verify, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = ctx.state;
        const { windowId, message } = ctx.request.body;
        if (!windowId || !message) {
            ctx.status = 400;
            ctx.body = { message: 'have no windowId or message.' };
            return;
        }
        const [results] = yield db_1.db.query('SELECT * FROM chat_windows WHERE window_id = ? AND user_id = ?', [windowId, userId]);
        if (results.length === 0) {
            ctx.status = 404;
            ctx.body = 'No window found.';
            return;
        }
        const currentWindow = results[0];
        if (!currentWindow) {
            throw 'Error on the server.';
        }
        const avatar = currentWindow.avatar;
        const openAIClient = (0, llm_1.getInstance)({
            token: 'sk-fhdy3k25u0ZMcrY83d948c3f14D04bA28a9389Fe0c6c20F3'
        });
        const prompt = getSystemPrompt(avatar);
        console.log('prompt', prompt);
        const [historys] = yield db_1.db.query('SELECT * FROM chats WHERE window_id = ? AND user_id = ? ORDER BY create_time DESC LIMIT 10;', [windowId, userId]);
        console.log('historys', historys, historys.length);
        const historyMessage = [];
        const length = (historys.length || 0);
        for (let i = 0; i < length; i++) {
            const currentHistory = historys[length - i - 1];
            const historyUserMessage = currentHistory.user_message;
            const historyAIMessage = currentHistory.avatar_response;
            historyMessage.push({ role: "user", content: historyUserMessage });
            historyMessage.push({ role: "assistant", content: historyAIMessage });
        }
        const messages = [
            { role: "system", content: prompt },
            ...historyMessage,
            { role: "user", content: message },
        ];
        console.log('messages', messages);
        const openAIResult = yield openAIClient.create({
            messages,
        });
        console.log('completion.choices[0].message', openAIResult.choices[0].message);
        const content = openAIResult.choices[0].message.content;
        const currentTime = +new Date();
        yield db_1.db.query('INSERT INTO chats (window_id, user_id, user_message, avatar_response, create_time, modify_time) VALUES (?, ?, ?, ?, ?, ?)', [windowId, userId, message, content, currentTime, currentTime]);
        ctx.status = 200;
        ctx.body = currentWindow;
    }
    catch (error) {
        console.log(error);
        ctx.status = 500;
        ctx.body = 'Error on the server.';
    }
}));
