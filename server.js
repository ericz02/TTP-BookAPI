const express = require("express");
const app = express();
const port = 4004;
const { query } = require("./database");
require("dotenv").config();


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
app.get("/books", async (req, res) => {

  try {
    const allBooks = await query("SELECT * FROM books_inventory")
    res.status(200).json(allBooks.rows)

  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Internal Server Error" });
  }
  
});

// Get a specific book
app.get("/books/:id", async (req, res) => {
  const bookId = parseInt(req.params.id, 10);

  try {
    const book = await query("SELECT * FROM books_inventory WHERE id = $1", [
      bookId,
    ]);

    if (book.rows.length > 0) {
      res.status(200).json(job.rows[0]);
    } else {
      res.status(404).send({ message: "Book not found, sorry!" });
    }
  } catch (error) {
    console.error("Something went wrong", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new book
app.post("/books", async (req, res) => {
  const { title, author, genre, publishDate, quantity } = req.body;

  try {
    const newBook = await query(
      `INSERT INTO books_inventory
        (title, author, genre, publishDate, quantity)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, author, genre, publishDate, quantity]
    );

    res.status(201).json(newBook.rows[0]);
  } catch (error) {
    console.error("Something went wrong", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});

// Update a specific book
app.patch("/books/:id", async (req, res) => {
  const bookId = parseInt(req.params.id, 10);

  const fieldNames = [
    "title",
    "author",
    "genre",
    "publishDate",
    "quantity",
  ].filter((name) => req.body[name]);

  let updatedValues = fieldNames.map((name) => req.body[name]);
  const setValuesSQL = fieldNames
    .map((name, i) => {
      return `${name} = $${i + 1}`;
    })
    .join(", ");

  try {
    const updatedBook = await query(
      `UPDATE books_inventory SET ${setValuesSQL} WHERE id = $${
        fieldNames.length + 1
      } RETURNING *`,
      [...updatedValues, bookId]
    );

    if (updatedBook.rows.length > 0) {
      res.status(200).json(updatedBook.rows[0]);
    } else {
      res.status(404).send({ message: "Book not found" });
    }
  } catch (error) {
    console.error("Something went wrong", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a specific book
app.delete("/books/:id", async (req, res) => {
  const bookId = parseInt(req.params.id, 10);

  try {
    const deleteBook = await query(
      "DELETE FROM books_inventory WHERE id = $1",
      [bookId]
    );

    if (deleteBook.rowCount > 0) {
      res.status(200).send({ message: "Book has been removed from inventory" });
    } else {
      res.status(404).send({ message: "No such book in our inventory" });
    }
  } catch (error) {
    console.error("Something went wrong", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
