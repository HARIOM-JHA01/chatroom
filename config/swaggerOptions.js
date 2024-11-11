const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Chatroom API",
            version: "1.0.0",
            description: "A simple Express chatroom API",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./routes/*.js"],
};

export default options;
