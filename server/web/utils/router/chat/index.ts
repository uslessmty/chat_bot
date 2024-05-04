import * as Router from 'koa-router';
import { verify } from '../../verify';
import { db } from '../../../../db';
import { QueryResult } from 'mysql2';
import { getInstance } from '../../../../llm';

const router = new Router<any, any>();

const PREFIX = '/api/chat';

router.post(`${PREFIX}/newconversation`, verify, async (ctx) => {
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
        const [result] = await db.query<QueryResult & {
            insertId: number;
        }>('INSERT INTO chat_windows (user_id, avatar) VALUES (?, ?)', [userId, avatar]);

        ctx.status = 200;
        ctx.body = {
            id:  result.insertId,
            message: 'window created' 
        };
      } catch (error) {
        console.log('error', error);
        ctx.status = 500;
        ctx.body = 'Error on the server.';
      }
});

router.post(`${PREFIX}/dialog`, verify, async (ctx) => {
    try {
        const { userId } = ctx.state;
        const { windowId, message } = ctx.request.body;
    
        if (!windowId || !message) {
            ctx.status = 400;
            ctx.body = { message: 'have no windowId or message.' };
            return;
        }
    
        const [results] = await db.query<QueryResult & {
            length?: number
          }>('SELECT * FROM chat_windows WHERE window_id = ? AND user_id = ?', [windowId, userId]);
        
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
    
        const openAIClient = getInstance({
            token: ''
        });
    
        const openAIResult = await openAIClient.create({
            messages: [
                { role: "system", content: avatar },
                { role: "user", content: message },
            ],
        });
    
        console.log('completion.choices[0].message', openAIResult.choices[0].message)
    
        ctx.status = 200;
        ctx.body = currentWindow;
    } catch (error) {
        ctx.status = 500;
        ctx.body = 'Error on the server.';
    }
});

export {
    router
};
