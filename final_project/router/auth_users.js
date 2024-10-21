const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
// let users = require("./auth_users.js").users;
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return users.some(user => user.username === username); // Check if username exists
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (!isValid(username)) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    // Create JWT token
    const accessToken = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });
    req.session.accessToken = accessToken; // Save token in session
    return res.status(200).json({ message: "Login successful", accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
    const { review } = req.query; // Review comes as a query parameter
    const username = req.user.username; // Get username from the session

    if (!review) {
        return res.status(400).json({ message: "Review is required." });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Add or update the review
    if (!books[isbn].reviews[username]) {
        books[isbn].reviews[username] = review; // Add new review
    } else {
        books[isbn].reviews[username] = review; // Update existing review
    }

    return res.status(200).json({ message: "Review added/modified successfully." });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.user.username; // Get username from the session

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found." });
    }

    delete books[isbn].reviews[username]; // Delete the user's review
    return res.status(200).json({ message: "Review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
