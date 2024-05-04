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
exports.getInstance = void 0;
const openai_1 = require("openai");
const llm_1 = require("../const/llm");
const getInstance = (config) => {
    const instance = new openai_1.OpenAI({
        apiKey: config.token,
        baseURL: llm_1.HOST,
    });
    instance.chat.completions.create;
    return {
        create: (params) => __awaiter(void 0, void 0, void 0, function* () {
            return instance.chat.completions.create({
                messages: params.messages,
                model: "gpt-3.5-turbo",
            });
        })
    };
};
exports.getInstance = getInstance;
