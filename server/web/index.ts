import { config } from 'dotenv';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as json from 'koa-json';
import {
    router
} from './utils/router/user';
import {
    router as chatRouter
} from './utils/router/chat';

config();

const app = new Koa();

app.use(bodyParser());
app.use(json());

app.use(router.routes())
    .use(router.allowedMethods());
app.use(chatRouter.routes())
    .use(chatRouter.allowedMethods());

app.listen(3000, () => {
    console.log('listening...');
});
