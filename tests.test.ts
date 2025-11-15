import { parseRequest } from "./server";

describe("good GET requets line", () => {
  test("empty path", () => {
    const raw =
      "GET / HTTP/1.1\r\n" +
      "Host: localhost:42069\r\n" +
      "User-Agent: curl/7.81.0\r\n" +
      "Accept: */*\r\n" +
      "\r\n";
    const req = parseRequest(raw);
    expect(req.requestLine?.httpVersion).toBe("HTTP/1.1");
    expect(req.requestLine?.method).toBe("GET");
    expect(req.requestLine?.requestTarget).toBe("/");
  });
});

describe("good GET requets line with path", () => {
  test("empty path", () => {
    const raw =
      "GET /coffee HTTP/1.1\r\n" +
      "Host: localhost:42069\r\n" +
      "User-Agent: curl/7.81.0\r\n" +
      "Accept: */*\r\n" +
      "\r\n";
    const req = parseRequest(raw);
    expect(req.requestLine.httpVersion).toBe("HTTP/1.1");
    expect(req.requestLine.method).toBe("GET");
    expect(req.requestLine.requestTarget).toBe("/coffee");
  });
});

describe("good GET requets line with path", () => {
  test("empty path", () => {
    const raw =
      "POST /submit HTTP/1.1\r\n" +
      "Host: localhost:42069\r\n" +
      "Content-Length: 13\r\n" +
      "\r\n" +
      "hello world!\n";
    const req = parseRequest(raw);
    expect(req.requestLine.httpVersion).toBe("HTTP/1.1");
    expect(req.requestLine.method).toBe("POST");
    expect(req.requestLine.requestTarget).toBe("/coffee");
  });
});
