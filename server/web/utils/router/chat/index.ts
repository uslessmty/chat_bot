import * as Router from 'koa-router';
import { verify } from '../../verify';
import { db } from '../../../../db';
import { QueryResult } from 'mysql2';

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

export {
    router
};
