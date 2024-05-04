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
exports.verify = void 0;
const jwt = require("jsonwebtoken");
const jwt_1 = require("../../../const/jwt");
const verify = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = ctx.headers['authorization'];
    if (!token) {
        ctx.status = 403;
        ctx.body = {
            message: 'No Token Provided.'
        };
        return;
    }
    try {
        const decode = jwt.verify(token, jwt_1.JWT_SECRET);
        ctx.state.userId = decode.id;
        yield next();
    }
    catch (error) {
        ctx.status = 500;
        ctx.body = {
            message: 'Fail to authenticate token.'
        };
    }
});
exports.verify = verify;
