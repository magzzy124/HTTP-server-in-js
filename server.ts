import net from "net";
import { getDefaultHeaders, WriteStatusLine } from "./response";
import { respond200, respond400, respond500 } from "./response";

const PORT = 3000;
const HOST = "127.0.0.1";
const SEPERATOR = "\r\n";

interface requestLine {
  method: string;
  requestTarget: string;
  httpVersion: string;
}

interface buffer {
  buffer: Buffer;
  pos: number;
  length: number;
}

enum requestState {
  initialized,
  headerParsing,
  bodyParsing,
  done,
}

interface myRequest {
  requestLine: requestLine | null;
  headers: Map<string, string>;
  body?: string;
  state: requestState;
}

export function parseRequest(buffer: buffer, request: any): void {
  while (true) {
    let segment: string | undefined;
    if (request.state != requestState.bodyParsing) {
      const indexOfCRLF = buffer.buffer.indexOf(SEPERATOR, buffer.pos);
      if (indexOfCRLF === -1) break;

      segment = buffer.buffer.toString("utf8", buffer.pos, indexOfCRLF);
      buffer.pos = indexOfCRLF + 2;
    }

    switch (request.state) {
      case requestState.initialized: {
        const parts = segment!.split(" ");
        if (parts.length !== 3)
          throw new Error("not a valid format of a request line");
        const [method, requestTarget, httpVersion] = parts;
        request.requestLine = { method, requestTarget, httpVersion };
        request.state = requestState.headerParsing;
        break;
      }
      case requestState.headerParsing: {
        if (segment === "") {
          request.state = requestState.bodyParsing;
          break;
        }

        let [key, value] = segment!.split(":");
        key = key.trim().toLowerCase();
        value = value.trim();

        if (request.headers.has(key)) {
          request.headers.set(key, request.headers.get(key) + "," + value);
        } else {
          request.headers.set(key, value);
        }
        break;
      }
      case requestState.bodyParsing: {
        if (request.headers.has("content-length")) {
          const contentLength = Number(request.headers.get("content-length"));
          request.body += buffer.buffer.toString(
            "utf8",
            buffer.pos,
            buffer.length,
          );
          buffer.pos = buffer.length;
          if (contentLength == request.body.length)
            request.state = requestState.done;
        } else request.state = requestState.done;

        return;
      }
    }
  }
}

function writeHeaders(socket: net.Socket, headers: Map<string, string>) {
  for (const [key, value] of Array.from(headers.entries())) {
    socket.write(`${key}:${value}\r\n`);
  }
  socket.write("\r\n");
}

const socketSet = new Set<net.Socket>();

const server = net.createServer((socket) => {
  console.log(
    "Client connected:",
    socket.remoteAddress + ":" + socket.remotePort,
  );
  socketSet.add(socket);

  const buffer = {
    pos: 0,
    length: 0,
    buffer: Buffer.alloc(4096),
  };

  const request: myRequest = {
    requestLine: null,
    headers: new Map(),
    body: "",
    state: requestState.initialized,
  };

  socket.on("data", (data: Buffer) => {
    buffer.buffer.set(data, buffer.length);
    buffer.length += data.length;

    parseRequest(buffer, request);
    let body = respond200();

    if (request.state == requestState.done) {
      if (request.requestLine?.requestTarget == "/yourproblem") {
        body = respond400();
      } else if (request.requestLine?.requestTarget == "/myproblem") {
        body = respond500();
      }
      socket.write(WriteStatusLine(200));
      const responseHeaders = new Map<string, string>();
      getDefaultHeaders(responseHeaders, 5);
      console.log(request);
      responseHeaders.set("Content-Length", body.length.toString());
      writeHeaders(socket, responseHeaders);
      socket.write(body);
      console.log("Respond!");
    }
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
