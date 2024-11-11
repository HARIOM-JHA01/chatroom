// chatModel.js
export const createChatData = (senderId, recipientId, message) => {
    return {
        senderId,
        recipientId,
        message,
        timestamp: new Date().toISOString(),
    };
};
