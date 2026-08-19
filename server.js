// Minimal static file server for the CompTIA A+ Core 1 exam simulator.
// Accepts --port / --host CLI args and PORT env so host/port are forwarded.
const http = require("http");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
function argVal(flag, fallback) {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}
const PORT = parseInt(process.env.PORT || argVal("--port", "7100"), 10);
const HOST = process.env.HOST || argVal("--host", "0.0.0.0");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const file = path.join(__dirname, path.normalize(p).replace(/^([/\\])+/, ""));
  if (!file.startsWith(__dirname)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(PORT, HOST, () => {
  console.log(`CompTIA A+ Core 1 exam simulator running at http://localhost:${PORT}/`);
});
