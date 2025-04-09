const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');

public_users.post("/register", (req,res) => {
  let {username, password} = req.body;

  if (!username || !password) {
    return res.status(403).json({error: "The username or password is not provided!!!"});
  }

  let usernameExisted = users.find(user => user.username === username);

  if (usernameExisted) {
    return res.status(404).json({error: "The username existed"});
  } else {
    res.send(JSON.stringify({
        message: "Register Successful"
    }))
    users.push({username, password});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    new Promise((resolve) => {
        setTimeout(() => resolve(books), 100);
    })
    .then(bookList => {
        res.status(200).json(bookList);
    })
    .catch( err => {
        res.status(400).json({ error: "Unavailable book list"});
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Retrive the ISBN from request parameters
  let ISBN = parseInt(req.params.isbn);

  new Promise((resolve,reject) => {
    const book = books[ISBN];
    if (book) {
        resolve(book);
    } else {
        reject(new Error("Book not found"));
    }
  })
  .then(book => {
    res.status(200).json(book);
  })
  .catch(error => {
    res.status(404).json({message: error.message});
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let filterred_books = [];
  let books_without_isbn = Object.values(books);
  let author = req.params.author;
  
  new Promise((resolve, reject) => {
    books_without_isbn.forEach((book) => {
        if (book["author"] === author ) {
            filterred_books.push(book)
        }
      });
    
    if (filterred_books.length !== 0) {
        resolve(filterred_books);
    } else {
        reject(new Error("Not found the book"));
      }
  })
  .then(filterred_books => {
    res.status(200).json(filterred_books)})
      .catch(error => {
    res.status(404).json({message: error.message});
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let filterred_books = [];
    let books_without_isbn = Object.values(books);
    let title = req.params.title;
    
    new Promise((resolve, reject) => {
      books_without_isbn.forEach((book) => {
          if (book["title"] === title ) {
              filterred_books.push(book)
          }
        });
      
      if (filterred_books.length !== 0) {
          resolve(filterred_books);
      } else {
          reject(new Error("Not found the book"));
        }
    })
    .then(filterred_books => {
      res.status(200).json(filterred_books)})
        .catch(error => {
      res.status(404).json({message: error.message});
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let ISBN = req.params.isbn;

  if (books[ISBN]) {
    res.send(JSON.stringify(books[ISBN]["reviews"]));
  } else {
    res.status(401).json({error : "isbn invalid"});
  }
});

module.exports.general = public_users;
