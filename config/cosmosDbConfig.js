import { CosmosClient } from "@azure/cosmos";
import dotenv from "dotenv";
dotenv.config();

const cosmosDbConnectionString = process.env.COSMOS_DB_CONN_STR;
const client = new CosmosClient(cosmosDbConnectionString);

const databaseName = process.env.COSMOS_DB_DB_NAME;
const containerName = process.env.COSMOS_DB_CONTAINER_NAME;

let database = client.database(databaseName);
let container = database.container(containerName);

async function testConnection() {
    try {
        await database.read();
        await container.read();
        console.log("Connected to CosmosDB successfully!");
    } catch (error) {
        console.error("Error connecting to CosmosDB:", error.message);
    }
}

testConnection();

export { container };
