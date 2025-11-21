enum statusCode {
  StatusOk = 200,
  StatusBadRequest = 400,
  StatusInternalServerError = 500,
}

export function WriteStatusLine(sCode: statusCode) {
  switch (sCode) {
    case statusCode.StatusOk: {
      return "HTTP/1.1 200 OK\r\n";
    }
    case statusCode.StatusBadRequest: {
      return "HTTP/1.1 400 Bad Request\r\n";
    }
    case statusCode.StatusInternalServerError: {
      return "HTTP/1.1 500 Internal Server Error\r\n";
    }
  }
}

export function getDefaultHeaders(
  headers: Map<string, string>,
  contentLength: number,
) {
  headers.set("Content-Length", `${contentLength}`);
  headers.set("Connection", "keep-alive");
  headers.set("Content-Type", "text/plain");
}

export function respond400() {
  return (
    "<html>" +
    "<head>" +
    "<title>400 Bad Request</title>" +
    "</head>" +
    "<body>" +
    "<h1>+Bad Request</h1>" +
    "<p>+Your request honestly kinda sucked.</p>" +
    "</body>" +
    "</html>"
  );
}

export function respond200() {
  return (
    "<html>" +
    "<head>" +
    "<title>200 OK</title>" +
    "</head>" +
    "<body>" +
    "<h1>Success!</h1>" +
    "<p>Your request was an absolute banger.</p>" +
    "</body>" +
    "</html>"
  );
}

export function respond500() {
  return (
    "<html>" +
    "<head>" +
    "<title>500 Internal Server Error</title>" +
    "</head>" +
    "<body>" +
    "<h1>Internal Server Error</h1>" +
    "<p>Okay, you know what? This one is on me.</p>" +
    "</body>" +
    "</html>"
  );
}
