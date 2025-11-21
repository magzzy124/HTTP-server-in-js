import net from "net";
import fs from "fs";

const HOST = "127.0.0.1";
const PORT = 3000;
const SEPARATOR = "\r\n";

const client = net.createConnection({ host: HOST, port: PORT }, () => {
  console.log("connected to", `${HOST}:${PORT}`);

  fs.readFile("./request.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    // client.wrap(data);
    const splitBody = data.split(SEPARATOR + SEPARATOR);
    const headersAndData = splitBody[0];
    const body = splitBody[1];

    // Send headers and data all at once
    client.write(headersAndData + SEPARATOR + SEPARATOR);

    // Send body in chunks
    const bodyChunks = [
      body.slice(0, Math.ceil(body.length / 3)),
      body.slice(Math.ceil(body.length / 3), 2 * Math.ceil(body.length / 3)),
      body.slice(2 * Math.ceil(body.length / 3)),
    ];

    bodyChunks.forEach((chunk, index) => {
      setTimeout(() => {
        const isLastChunk = index === bodyChunks.length - 1;
        client.write(isLastChunk ? chunk.trimEnd() : chunk); // Remove trailing CRLF only for the last chunk
        console.log(chunk);
      }, 100 * index);
    });
  });
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
