import { config } from 'dotenv';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as json from 'koa-json';
import {
    router
} from './utils/router/user';
config();

const app = new Koa();

app.use(bodyParser());
app.use(json());

app.use(router.routes())
    .use(router.allowedMethods());

app.listen(3000, () => {
    console.log('listening...');
});
