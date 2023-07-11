const express = require("express");
const app = express();
const port = 4000;

// Welcome page if page is working
app.get("/", (req, res) => {
  res.send("Hello, Welcome to Book Inventory Management System");
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})

// uses the middleware
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`Request: ${req.method} ${req.originalUrl} ${res.statusCode}`)
  })
  next();
})

// built in middleware from express
app.use(express.json()) 

// List all books
app.get("/books", (req, res) => {
  // This will eventually return a list of all books
});

// Get a specific book
app.get("/books/:id", (req, res) => {
  // This will eventually return a specific book
});

// Create a new book
app.post("/books", (req, res) => {
  // This will eventually create a new book
});

// Update a specific book
app.patch("/books/:id", (req, res) => {
  // This will eventually update a specific book
});

// Delete a specific book
app.delete("/books/:id", (req, res) => {
  // This will eventually delete a specific book
});