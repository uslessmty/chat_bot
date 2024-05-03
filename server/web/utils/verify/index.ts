import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../const/jwt';

export const verify = async (ctx, next) => {
    const token = ctx.headers['authorization'];
    if (!token) {
        ctx.status = 403;
        ctx.body = {
            message: 'No Token Provided.'
        }
        return;
    }

    try {
        const decode = jwt.verify(token, JWT_SECRET);
        ctx.state.userId = decode.id;
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            message: 'Fail to authenticate token.'
        }
    }
}