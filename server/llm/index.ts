
import { OpenAI } from 'openai';
import { HOST } from '../const/llm';

type IMessageType = 'system' | 'user' | 'assistant';
type IMessage = {
    role: IMessageType;
    content: string;
};

export const getInstance = (config: {
    token: string;
}) => {
    const instance = new OpenAI({
        apiKey: config.token,
        baseURL: HOST,
    });
    instance.chat.completions.create
    
    return {
        create: async(params: {
            messages: IMessage[]
        }) => {
            return instance.chat.completions.create({
                messages: params.messages,
                model: "gpt-3.5-turbo",
            });
        }
    };
}