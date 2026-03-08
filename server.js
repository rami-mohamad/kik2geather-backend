// server.js
const http = require("http");
require("./config/env"); // loads dotenv

const app = require("./app");

const PORT = process.env.PORT || process.env.DEV_SERVER_PORT || 4000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
