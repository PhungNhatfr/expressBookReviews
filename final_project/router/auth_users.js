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
        let token = jwt.sign({username}, SECRET_KEY, {expiresIn: "1h"});
        res.send(JSON.stringify({
            message: "Login successful",
            token
        }, null, 2));
        req.session.token = token;
    } else {
        return res.status(404).json({error: "The user doesn't exist"});
    }
});

//Middleware to verify authentication
const verifyToken = (req, res, next) => {
    let token = req.session.token;

    if (!token) {
        return res.status(404).json({
            error: "Error: Access denied!"
        })
    }

    jwt.verify(token, SECRET_KEY, (error, decoded) => {
        if (error) {
            return res.status(404).json({
                error: "Invalid token"
            })
        } else {
            req.username = decoded.username;
            next();
        }
    })
}
// Add a book review
regd_users.put("/auth/review/:isbn",verifyToken ,(req, res) => {
  let username = req.username;
  let isbn = req.params.isbn;
  let {review} = req.body;

  if (!books[isbn]) {
    return res.status(401).json({error: "Can't find this book"});
  }

  if (!review) {
    return res.status(202).json({message: "You don't comment"});
  }

  books[isbn].review[username] = review;

  res.send(JSON.stringify({
    message : books[isbn].review[username]
  }, null, 2));

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
