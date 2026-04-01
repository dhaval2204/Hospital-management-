const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("🔥 Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  });

  // 🔥 GLOBAL SOCKET ACCESS
  global.io = io;

  server.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
  });
});