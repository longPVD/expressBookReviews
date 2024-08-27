const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
// Array to store registered users (in a real application, this should be stored in a database)



public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user already exists
  const userExists = users.some(user => user.username === username);

  if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
  }

  // Register the new user
  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});
// public_users.post("/register", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

//-------------------///////
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books); 
  // return res.status(300).json({message: "Yet to be implemented"});
});


// Using async/await to get all books
public_users.get('/async-books', async (req, res) => {
  try {
      // Simulate a delayed response with a Promise
      const getBooks = () => {
          return new Promise((resolve, reject) => {
              setTimeout(() => {
                  resolve(books); // Replace this with an actual database call
              }, 1000); // Simulates a 1-second delay
          });
      };

      const booksList = await getBooks();
      res.status(200).json(booksList);
  } catch (error) {
      res.status(500).json({ message: "Error retrieving books" });
  }
});


//---------------------------//
// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
//  });

public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
      res.status(200).json(book);
  } else {
      res.status(404).json({ message: "Book not found" });
  }
});

// Using async/await to get book details by ISBN
public_users.get('/async-isbn/:isbn', async (req, res) => {
  try {
      const getBookByISBN = (isbn) => {
          return new Promise((resolve, reject) => {
              const book =  books[isbn];
              if (book) {
                  resolve(book);
              } else {
                  reject("Book not found");
              }
          });
      };

      const bookDetails = await getBookByISBN(req.params.isbn);
      res.status(200).json(bookDetails);
  } catch (error) {
      res.status(404).json({ message: error });
  }
});



// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author);

  if (booksByAuthor.length > 0) {
    res.status(200).json(booksByAuthor);
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});


// Using async/await to get books by author
public_users.get('/async-author/:author', async (req, res) => {
  try {
      const getBooksByAuthor = (author) => {
          return new Promise((resolve, reject) => {
              const booksByAuthor = Object.values(books).filter(b => b.author.toLowerCase() === author.toLowerCase());
              if (booksByAuthor.length > 0) {
                  resolve(booksByAuthor);
              } else {
                  reject("No books found by this author");
              }
          });
      };

      const booksList = await getBooksByAuthor(req.params.author);
      res.status(200).json(booksList);
  } catch (error) {
      res.status(404).json({ message: error });
  }
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(b => b.title.toLowerCase() === title.toLowerCase());

  if (booksByTitle.length > 0) {
      res.status(200).json(booksByTitle);
  } else {
      res.status(404).json({ message: "No books found with this title" });
  }
});


// Using async/await to get books by title
public_users.get('/async-title/:title', async (req, res) => {
  try {
      const getBooksByTitle = (title) => {
          return new Promise((resolve, reject) => {
              const booksByTitle = Object.values(books).filter(b => b.title.toLowerCase() === title.toLowerCase());
              if (booksByTitle.length > 0) {
                  resolve(booksByTitle);
              } else {
                  reject("No books found with this title");
              }
          });
      };

      const booksList = await getBooksByTitle(req.params.title);
      res.status(200).json(booksList);
  } catch (error) {
      res.status(404).json({ message: error });
  }
});



//  Get book review
// public_users.get('/review/:isbn',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
      res.status(200).json(book.reviews);
  } else {
      res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
