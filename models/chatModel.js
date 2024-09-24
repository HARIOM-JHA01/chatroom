import { container } from "../config/cosmosDbConfig.js";

class ChatModel {
    async saveMessage(messageData) {
        const { resource: createdItem } = await container.items.create(
            messageData
        );
        return createdItem;
    }

    async getMessagesByRoom(roomId) {
        const query = `SELECT * FROM c WHERE c.roomId = @roomId ORDER BY c.timestamp ASC`;
        const { resources } = await container.items
            .query({ query, parameters: [{ name: "@roomId", value: roomId }] })
            .fetchAll();
        return resources;
    }
}

export default new ChatModel();
