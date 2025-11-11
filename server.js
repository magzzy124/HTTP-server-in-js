import net from "net";

const PORT = 3000;
const HOST = "127.0.0.1"; // Loopback address for local testing

const server = net.createServer((socket) => {
  console.log(
    "Client connected:",
    socket.remoteAddress + ":" + socket.remotePort,
  );

  socket.on("data", (data) => {
    console.log(`Received from client: ${data.toString()}`);
    socket.write(`Server received: ${data.toString()}`);
  });

  socket.on("end", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });
});

server.on("error", (err) => {
  console.error("Server error:", err.message);
});

server.listen(PORT, HOST, () => {
  console.log(`TCP server listening on ${HOST}:${PORT}`);
});
