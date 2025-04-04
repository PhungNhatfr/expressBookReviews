const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const SECRET_KEY = "12345";

const isValid = (username)=>{ 
    return users.find(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ 
    return users.find(user => user.username && user.username === username 
                            && user.password && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    let {username, password} = req.body;
    

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({username}, SECRET_KEY, {expiresIn: "1h"});
        req.session.authorization = {
            accessToken, 
            username
        };
        res.send(JSON.stringify({
            message: "Login successful",
            accessToken,
            authorization: req.session.authorization
        }, null, 2));
    } else {
        return res.status(404).json({error: "The user doesn't exist"});
    }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let username = req.user.username;
  let isbn = req.params.isbn;
  let {review} = req.query;

  if (!books[isbn]) {
    return res.status(401).json({error: "Can't find this book"});
  }

  if (!review) {
    return res.status(202).json({message: "You don't have review"});
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }cd

  books[isbn].reviews[username] = review;

  res.send(JSON.stringify({
    book: isbn,
    review : books[isbn].reviews
  }, null, 2));
});

//Delete a book review 
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let username = req.user.username;
    let isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(401).json({error: "Can't find this book"});
  }

  if (!books[isbn].reviews[username]) {
    return res.status(202).json({message: "Not found the review for this user"});
  }

  delete books[isbn].reviews[username];

  res.send(JSON.stringify({
    message : "Delete successful",
    user: username,
    book: isbn
  }, null, 2));
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
