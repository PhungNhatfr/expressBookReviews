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

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
