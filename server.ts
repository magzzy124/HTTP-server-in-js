import net from "net";

const PORT = 3000;
const HOST = "127.0.0.1";
const SEPERATOR = "\r\n";

interface requestLine {
  method: string;
  requestTarget: string;
  httpVersion: string;
}

interface Request {
  requestLine: requestLine | null;
  headers: Map<string, string>;
  body?: string;
}

const request: Request = {
  requestLine: null,
  headers: new Map(),
  body: "",
};

export function parseRequest(buffer: {
  buffer: Buffer;
  pos: number;
  length: number;
}): void {
  while (true) {
    const indexOfCRLF = buffer.buffer.indexOf(SEPERATOR, buffer.pos);
    if (indexOfCRLF == -1) break;

    const segment = buffer.buffer.toString("utf8", buffer.pos, indexOfCRLF);
    buffer.pos = indexOfCRLF + 2;

    if (segment == "") {
      if (request.headers.has("content-length")) {
        request.body = buffer.buffer.toString(
          "utf8",
          buffer.pos,
          buffer.length,
        );
      }

      console.log(request);
      break;
    }

    if (request.requestLine == null) {
      const parts = segment.split(" ");
      if (parts.length != 3)
        throw new Error("not a valid format of a request line");
      const [method, requestTarget, httpVersion] = parts;
      request.requestLine = { method, requestTarget, httpVersion };
    } else {
      let [key, value] = segment.split(":");

      key = key.trim().toLowerCase();
      value = value.trim();

      if (request.headers.has(key)) {
        request.headers.set(key, request.headers.get(key) + "," + value);
      } else request.headers.set(key, value);
    }
  }
}

const buffer = {
  pos: 0,
  length: 0,
  buffer: Buffer.alloc(4096),
};

const server = net.createServer((socket) => {
  console.log(
    "Client connected:",
    socket.remoteAddress + ":" + socket.remotePort,
  );

  socket.on("data", (data: Buffer) => {
    buffer.buffer.set(data, buffer.length);
    buffer.length += data.length;

    parseRequest(buffer);
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
