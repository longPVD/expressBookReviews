const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('./config');
let users = [
  { username: "testuser", password: bcrypt.hashSync("password123", 10) }
];
let registeredUsers = [
  { username: "testuser", password: "password123" },
  { username: "testuser2", password: "password456" },
  { username: "testuser3", password: "password789" }

];

// const isValid = (username)=>{ //returns boolean
// //write code to check is the username is valid
// }
// Validate username
const isValid = (username) => typeof username === 'string' && username.trim().length >= 3;



// const authenticatedUser = (username,password)=>{ //returns boolean
// //write code to check if username and password match the one we have in records.
// }
// Authenticate user
const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);
  return user ? bcrypt.compareSync(password, user.password) : false;
};



//only registered users can login
// regd_users.post("/login", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// User login
// regd_users.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//       return res.status(400).json({ message: "Username and password are required" });
//   }

//   const user = registeredUsers.find(user => user.username === username && user.password === password);

//   if (user) {
//       res.status(200).json({ message: "Login successful" });
//   } else {
//       res.status(401).json({ message: "Invalid credentials" });
//   }
// });

// Example login route
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!isValid(username)) {
      return res.status(400).json({ message: "Invalid username" });
  }

  if (authenticatedUser(username, password)) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: "Login successful", token });
  } else {
      res.status(401).json({ message: "Invalid credentials" });
  }
});


// Add a book review
// regd_users.put("/auth/review/:isbn", (req, res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;

  const book = books[isbn];

  if (!book) {
      return res.status(404).json({ message: "Book not found" });
  }

  // Add the review to the book's reviews array
  book.reviews.push(review);
  res.status(200).json({ message: "Review added/updated successfully" });
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  // const book = books.find(b => b.isbn === isbn);
  const book = books[isbn];
  if (!book) {
      return res.status(404).json({ message: "Book not found" });
  }

  // Clear the reviews for simplicity (you can add logic to delete a specific review)
  book.reviews = [];
  res.status(200).json({ message: "Reviews deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
