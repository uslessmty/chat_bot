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
const milvus2_sdk_node_1 = require("@zilliz/milvus2-sdk-node");
const address = "localhost:19530";
const username = "minioadmin";
const password = "minioadmin";
const ssl = false;
const databaseName = 'conversation';
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const milvusClient = new milvus2_sdk_node_1.MilvusClient({ address, ssl, username, password });
    const databaseResponse = yield milvusClient.listDatabases();
    const databaseList = databaseResponse.db_names;
    if (!databaseList.some(db_name => db_name === databaseName)) {
        yield milvusClient.createDatabase({
            db_name: 'conversation'
        });
    }
    console.log('milvusClient database', yield milvusClient.listDatabases());
});
init();
