# MT1-LABEXAM — Shopping Cart Management

This project follows the supplied MT1 lab specification. It contains two independent applications:

- **Part A:** built-in Node.js `http` and `fs` modules on port `3000`
- **Part B:** Express.js CRUD REST API on port `4000`
- **Storage:** JavaScript arrays only; no database

## Requirements

Install a current LTS version of Node.js and npm.

## Setup

Open a terminal in this project folder and run:

```bash
npm install
```

## Run Part A (HTTP + FS)

```bash
npm run start:http
```

Open these URLs:

- http://localhost:3000/
- http://localhost:3000/cart
- http://localhost:3000/about
- http://localhost:3000/home

Add a product with `POST http://localhost:3000/add-to-cart` and a JSON body, for example:

```json
{
  "id": 4,
  "productName": "Bluetooth Headphones",
  "price": 1499,
  "quantity": 1,
  "category": "Electronics"
}
```

## Run Part B (Express REST API)

Open a **second terminal** in the same folder:

```bash
npm run start:express
```

The servers must run in separate terminals because they use different ports.

## API endpoints

Base URL: `http://localhost:4000`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/cart` | Get all items, count, and total cart value |
| GET | `/cart/:id` | Get one item and its `price × quantity` total |
| POST | `/cart` | Add a product (returns HTTP 201) |
| PUT | `/cart/:id` | Update supplied product fields |
| DELETE | `/cart/:id` | Delete a product |

### Postman examples

For POST, choose **Body → raw → JSON**:

```json
{
  "id": 4,
  "productName": "Bluetooth Headphones",
  "price": 1499,
  "quantity": 1,
  "category": "Electronics"
}
```

For PUT `http://localhost:4000/cart/1`:

```json
{
  "productName": "Wireless Mouse",
  "price": 899,
  "quantity": 3,
  "category": "Electronics"
}
```

For all JSON requests, set `Content-Type: application/json`.

## Suggested verification sequence

1. Start the HTTP server and open `/`, `/cart`, `/about`, and `/home`.
2. Start the Express server in another terminal.
3. Test GET `/cart`.
4. Test GET `/cart/1`.
5. Test POST `/cart` with ID `4`.
6. Test PUT `/cart/1`.
7. Test DELETE `/cart/1`.
8. Test an unknown URL and a missing product ID to verify 404 responses.
9. Capture your own screenshots in `screenshots/` while the servers and Postman are running.

## GitHub submission

Create a repository named `MT1-LABEXAM`, then from this folder run:

```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/MT1-LABEXAM.git
git push -u origin main
```

After verifying each module, use meaningful commits such as:

```bash
git add .
git commit -m "Implement Node HTTP routes and FS page serving"
git add .
git commit -m "Add Express shopping cart CRUD API"
git add .
git commit -m "Document API testing and submission steps"
git push
```

Replace `YOUR-USERNAME` with your GitHub username. GitHub pushes and screenshots must be completed using your own account and environment.

## Screenshots checklist

The `screenshots/` folder is intentionally included for submission evidence. Add real screenshots of:

- [ ] HTTP server running in terminal
- [ ] `/home` page loaded in browser (FS module)
- [ ] Express server running in terminal
- [ ] Postman GET, POST, PUT and DELETE requests
- [ ] GitHub repository and commit history

Do not use placeholder images as evidence; capture screenshots after running the application.
