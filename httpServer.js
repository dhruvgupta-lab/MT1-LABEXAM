import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const htmlPath = path.join(__dirname, "public", "index.html");
const PORT = 3000;

const cart = [
  { id: 1, productName: "Wireless Mouse", price: 799, quantity: 2, category: "Electronics" },
  { id: 2, productName: "Notebook", price: 99, quantity: 3, category: "Stationery" },
  { id: 3, productName: "Water Bottle", price: 249, quantity: 1, category: "Home" }
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data, null, 2));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body.trim()) return reject(new Error("Request body is required"));
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function validProduct(product) {
  return product &&
    product.id !== undefined && Number.isInteger(Number(product.id)) &&
    typeof product.productName === "string" && product.productName.trim() &&
    Number.isFinite(Number(product.price)) && Number(product.price) >= 0 &&
    Number.isInteger(Number(product.quantity)) && Number(product.quantity) > 0;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;

  if (req.method === "GET" && pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<!doctype html><html><head><title>Shopping Cart</title></head><body><h1>Welcome to Shopping Cart Management</h1><p>Node.js HTTP module demonstration.</p><p>Try <a href='/cart'>/cart</a>, <a href='/about'>/about</a>, and <a href='/home'>/home</a>.</p></body></html>");
    return;
  }

  if (req.method === "GET" && pathname === "/cart") {
    sendJson(res, 200, cart);
    return;
  }

  if (req.method === "GET" && pathname === "/about") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<!doctype html><html><head><title>About</title></head><body><h1>About this application</h1><p>A sample shopping cart built with Node.js HTTP and FS modules. Data is stored in memory.</p></body></html>");
    return;
  }

  if (req.method === "GET" && pathname === "/home") {
    fs.readFile(htmlPath, "utf8", (error, html) => {
      if (error) {
        sendJson(res, 500, { error: "Unable to read the home page file." });
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
    return;
  }

  if (req.method === "POST" && pathname === "/add-to-cart") {
    try {
      const product = await readJsonBody(req);
      if (!validProduct(product)) {
        sendJson(res, 400, {
          error: "Invalid product. Required: integer id, non-empty productName, non-negative price, and positive integer quantity."
        });
        return;
      }
      if (cart.some(item => item.id === Number(product.id))) {
        sendJson(res, 409, { error: "A product with this ID already exists." });
        return;
      }
      const newProduct = {
        id: Number(product.id),
        productName: product.productName.trim(),
        price: Number(product.price),
        quantity: Number(product.quantity),
        ...(typeof product.category === "string" ? { category: product.category } : {})
      };
      cart.push(newProduct);
      sendJson(res, 201, { message: "Product added successfully", product: newProduct });
    } catch (error) {
      sendJson(res, 400, { error: error.message || "Invalid request." });
    }
    return;
  }

  sendJson(res, 404, { error: "Route not found." });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
