import * as Router from 'koa-router';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { db } from '../../db';
import { JWT_SECRET } from '../../../../const/jwt';
import { QueryResult } from 'mysql2';

type Customer = {
    request: {
        body: {
            username?: string;
            password?: string;
        };
    }
};
const router = new Router<any, Customer>();

const PREFIX = '/api/user';

router.post(`${PREFIX}/register`, async (ctx) => {
    const { username, password } = ctx.request.body;

    if (!username || !password) {
        ctx.status = 400;
        ctx.body = { message: 'have no username or password.' };
        return;
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    try {
      await db.query('INSERT INTO user (username, password) VALUES (?, ?)', [username, hashedPassword]);
      ctx.status = 201;
      ctx.body = { message: 'User created' };
    } catch (error) {
      ctx.status = 500;
      ctx.body = 'Error on the server.';
    }

});

router.post(`${PREFIX}/login`, async (ctx) => {
    const { username, password } = ctx.request.body;

    if (!username || !password) {
        ctx.status = 400;
        ctx.body = { message: 'have no username or password.' };
        return;
    }
  
    try {
      const [results] = await db.query<QueryResult & {
        length?: number
      }>('SELECT * FROM user WHERE username = ?', [username]);

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
      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: 86400000 // 24 * 1000 hours
      });
  
      ctx.status = 200;
      ctx.body = { auth: true, token: token };
    } catch (error) {
      ctx.status = 500;
      ctx.body = 'Error on the server.';
    }
});

export {
    router
};