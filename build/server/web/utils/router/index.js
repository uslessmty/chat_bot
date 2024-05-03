"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const Router = require("koa-router");
const user_1 = require("./user");
const mainRouter = new Router();
exports.router = mainRouter;
mainRouter.use('/', user_1.router.routes, user_1.router.allowedMethods());
