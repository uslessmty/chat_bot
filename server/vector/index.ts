import { MilvusClient } from "@zilliz/milvus2-sdk-node";
import { HOST, USERNAME, PASSWORD, DATABASE } from "../const/vector";
const address = HOST;
const username = USERNAME;
const password = PASSWORD;
const databaseName = DATABASE;

const ssl = false;

const init = async () => {
    const milvusClient = new MilvusClient({address, ssl, username, password});
    const databaseResponse = await milvusClient.listDatabases();
    const databaseList = databaseResponse.db_names;

    if (!databaseList.some(db_name => db_name === databaseName)) {
        await milvusClient.createDatabase({
            db_name: databaseName
        });
    }

    console.log('milvusClient database', await milvusClient.listDatabases());
}

init();
