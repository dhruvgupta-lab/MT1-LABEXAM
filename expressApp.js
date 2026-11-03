import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json({ limit: "1mb" }));

let cart = [
  { id: 1, productName: "Wireless Mouse", price: 799, quantity: 2, category: "Electronics" },
  { id: 2, productName: "Notebook", price: 99, quantity: 3, category: "Stationery" },
  { id: 3, productName: "Water Bottle", price: 249, quantity: 1, category: "Home" }
];

function validateNewProduct(body) {
  return body &&
    Number.isInteger(Number(body.id)) &&
    typeof body.productName === "string" && body.productName.trim().length > 0 &&
    Number.isFinite(Number(body.price)) && Number(body.price) >= 0 &&
    Number.isInteger(Number(body.quantity)) && Number(body.quantity) > 0;
}

function normalizeProduct(body) {
  return {
    id: Number(body.id),
    productName: body.productName.trim(),
    price: Number(body.price),
    quantity: Number(body.quantity),
    category: typeof body.category === "string" ? body.category : "Uncategorized"
  };
}

function getProductById(id) {
  return cart.find(product => product.id === Number(id));
}

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Shopping Cart REST API",
    endpoints: ["GET /cart", "GET /cart/:id", "POST /cart", "PUT /cart/:id", "DELETE /cart/:id"]
  });
});

app.get("/cart", (req, res) => {
  res.status(200).json({
    items: cart,
    itemCount: cart.length,
    totalCartValue: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  });
});

app.get("/cart/:id", (req, res) => {
  const product = getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found." });
  res.status(200).json({
    ...product,
    totalPrice: product.price * product.quantity
  });
});

app.post("/cart", (req, res) => {
  if (!validateNewProduct(req.body)) {
    return res.status(400).json({
      error: "Invalid product. Required: integer id, non-empty productName, non-negative price, and positive integer quantity."
    });
  }
  const product = normalizeProduct(req.body);
  if (cart.some(item => item.id === product.id)) {
    return res.status(409).json({ error: "A product with this ID already exists." });
  }
  cart.push(product);
  res.status(201).json({ message: "Product added successfully", product });
});

app.put("/cart/:id", (req, res) => {
  const product = getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found." });

  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "Request body must be a JSON object." });
  }

  if (body.productName !== undefined &&
      (typeof body.productName !== "string" || !body.productName.trim())) {
    return res.status(400).json({ error: "productName must be a non-empty string." });
  }
  if (body.price !== undefined &&
      (!Number.isFinite(Number(body.price)) || Number(body.price) < 0)) {
    return res.status(400).json({ error: "price must be a non-negative number." });
  }
  if (body.quantity !== undefined &&
      (!Number.isInteger(Number(body.quantity)) || Number(body.quantity) <= 0)) {
    return res.status(400).json({ error: "quantity must be a positive integer." });
  }
  if (body.category !== undefined && typeof body.category !== "string") {
    return res.status(400).json({ error: "category must be a string." });
  }

  if (body.productName !== undefined) product.productName = body.productName.trim();
  if (body.price !== undefined) product.price = Number(body.price);
  if (body.quantity !== undefined) product.quantity = Number(body.quantity);
  if (body.category !== undefined) product.category = body.category;

  res.status(200).json({
    message: "Product updated successfully",
    product,
    totalPrice: product.price * product.quantity
  });
});

app.delete("/cart/:id", (req, res) => {
  const index = cart.findIndex(product => product.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Product not found." });
  const [deletedProduct] = cart.splice(index, 1);
  res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "Invalid JSON body." });
  }
  console.error(error);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
