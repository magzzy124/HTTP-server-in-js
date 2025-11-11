import net from "net";

const HOST = "127.0.0.1";
const PORT = 3000;

const client = net.createConnection({ host: HOST, port: PORT }, () => {
  console.log("connected to", `${HOST}:${PORT}`);
  client.write("hello server\n"); // send initial message
});

client.setEncoding("utf8");

client.on("data", (data) => {
  console.log("received:", data);
  // respond, parse protocol, etc.
});

client.on("end", () => {
  console.log("server closed connection");
});

client.on("error", (err) => {
  console.error("socket error:", err.message);
});
