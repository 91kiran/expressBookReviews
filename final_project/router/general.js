const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
   const { username, password } = req.body;

    // Check if the username or password is missing
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username is already registered
    if (isValid(username)) {
        return res.status(400).json({ message: "Username is already taken" });
    }

    // Register the new user
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Task 10: Get all books using async/await
public_users.get('/', async (req, res) => {
    try {
        const allBooks = await new Promise((resolve) => {
            resolve(books); // Simulate fetching books from a database
        });

        return res.status(200).json(allBooks);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books", error });
    }
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   return res.status(200).send(JSON.stringify(books, null, 4));
// });

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;

//     if (books[isbn]) {
//         return res.status(200).json(books[isbn]);
//     } else {
//         return res.status(404).json({ message: "Book not found" });
//     }
//  });

 // Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const { isbn } = req.params;

    try {
        const bookDetails = await new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]); // Book found
            } else {
                reject(new Error('Book not found'));
            }
        });

        return res.status(200).json(bookDetails);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});


  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const author = req.params.author;
//     let booksByAuthor = [];

//     for (let key in books) {
//         if (books[key].author === author) {
//             booksByAuthor.push(books[key]);
//         }
//     }

//     if (booksByAuthor.length > 0) {
//         return res.status(200).json(booksByAuthor);
//     } else {
//         return res.status(404).json({ message: "No books found by this author" });
//     }
// });


// Task 12: Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const { author } = req.params;

    try {
        const booksByAuthor = await new Promise((resolve) => {
            const result = Object.values(books).filter(book => book.author === author);
            resolve(result);
        });

        return res.status(200).json(booksByAuthor);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author", error });
    }
});




// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const title = req.params.title;
//     let booksByTitle = [];

//     for (let key in books) {
//         if (books[key].title === title) {
//             booksByTitle.push(books[key]);
//         }
//     }

//     if (booksByTitle.length > 0) {
//         return res.status(200).json(booksByTitle);
//     } else {
//         return res.status(404).json({ message: "No books found with this title" });
//     }
// });

// Task 13: Get book details based on title
public_users.get('/title/:title', async (req, res) => {
    const { title } = req.params;

    try {
        const booksByTitle = await new Promise((resolve) => {
            const result = Object.values(books).filter(book => book.title === title);
            resolve(result);
        });

        return res.status(200).json(booksByTitle);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title", error });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
      const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }

});

module.exports.general = public_users;
