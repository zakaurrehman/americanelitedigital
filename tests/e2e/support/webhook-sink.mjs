// Minimal webhook receiver for e2e tests. Records inquiries in memory; responds 500 when the
// name contains "FAIL-WEBHOOK" so the failure path can be exercised.
import { createServer } from "node:http";

const port = Number(process.argv[2] ?? 4399);
const received = [];

createServer((req, res) => {
  if (req.method === "GET" && req.url === "/health") return res.end("ok");
  if (req.method === "GET" && req.url === "/requests") {
    res.setHeader("content-type", "application/json");
    return res.end(JSON.stringify(received));
  }
  if (req.method === "POST" && req.url === "/hook") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const payload = JSON.parse(body);
      received.push({ payload, signature: req.headers["x-aed-signature"] ?? null });
      res.statusCode = String(payload.name).includes("FAIL-WEBHOOK") ? 500 : 200;
      res.end();
    });
    return;
  }
  res.statusCode = 404;
  res.end();
}).listen(port, "127.0.0.1");
