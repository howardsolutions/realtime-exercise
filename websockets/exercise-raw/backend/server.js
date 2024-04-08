import http from "http";
import handler from "serve-handler";
import nanobuffer from "nanobuffer";

// these are helpers to help you deal with the binary data that websockets use
import objToResponse from "./obj-to-response.js";
import generateAcceptValue from "./generate-accept-value.js";
import parseMessage from "./parse-message.js";

// init state
let connections = [];
const msg = new nanobuffer(50);
const getMsgs = () => Array.from(msg).reverse();

msg.push({
  user: "brian",
  text: "hi",
  time: Date.now(),
});

// serve static assets
const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: "./frontend",
  });
});

server.on("upgrade", (req, socket) => {
  if (req.headers["upgrade"] !== "websocket") {
    socket.end("HTTP/1.1 400 Bad Request");
    return;
  }

  const acceptKey = req.headers["sec-websocket-key"];
  const acceptValue = generateAcceptValue(acceptKey);

  const headers = [
    "HTTP/1.1 101 Web Socket Protocol Handshake",
    "Upgrade: WebSocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${acceptValue}`,
    `Sec-WebSocket-Protocol: json`,
    "\r\n", // (create break line) say to the browser here is the end of the headers, after that everything is DATA
  ];

  // establish the connection header
  socket.write(headers.join("\r\n"));

  // write first response data to the connected socket (connected user)
  socket.write(objToResponse({ msg: getMsgs() }));

  connections.push(socket);

  // receive new chat message from the client
  socket.on("data", (buffer) => {
    const message = parseMessage(buffer);

    // if we received msg from client
    if (message) {
      msg.push({
        user: message.user,
        text: message.text,
        time: Date.now(),
      });

      // broadcast the new msg to all the socket
      connections.forEach((sock) =>
        sock.write(objToResponse({ msg: getMsgs() }))
      );
    } else if (message === null) {
      socket.end();
      // go down to the line below, and remove the socket out of current connections list
    }
  });

  socket.on("end", () => {
    connections.forEach((s) => s !== socket);
  });
});

const port = process.env.PORT || 8080;
server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
