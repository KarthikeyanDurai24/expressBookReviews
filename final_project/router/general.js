const express = require('express');
const books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;
const public_users = express.Router();

/**
 * TASK 6: Register a new user
 */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user already exists
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});

/**
 * TASK 10: Get all books (using async/await & Promise)
 */
public_users.get('/', async (req, res) => {
  try {
    const allBooks = await new Promise((resolve) => resolve(books));
    return res.status(200).send(allBooks);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch books" });
  }
});

/**
 * TASK 11: Get book details by ISBN
 */
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject("Book not found");
    });
    return res.status(200).send(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

/**
 * TASK 12: Get book details by author
 */
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const result = await new Promise((resolve) => {
      let filtered = {};
      Object.keys(books).forEach(key => {
        if (books[key].author === author) filtered[key] = books[key];
      });
      resolve(filtered);
    });
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

/**
 * TASK 13: Get book details by title
 */
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const result = await new Promise((resolve) => {
      let filtered = {};
      Object.keys(books).forEach(key => {
        if (books[key].title === title) filtered[key] = books[key];
      });
      resolve(filtered);
    });
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});

/**
 * TASK 5: Get book review by ISBN
 */
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const reviews = await new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn].reviews);
      else reject("Book not found");
    });
    return res.status(200).send(reviews);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

module.exports.general = public_users;
