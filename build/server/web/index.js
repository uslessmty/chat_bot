"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const json = require("koa-json");
const user_1 = require("./utils/router/user");
require("./utils/vector");
(0, dotenv_1.config)();
const app = new Koa();
app.use(bodyParser());
app.use(json());
app.use(user_1.router.routes())
    .use(user_1.router.allowedMethods());
app.listen(3000, () => {
    console.log('listening...');
});
