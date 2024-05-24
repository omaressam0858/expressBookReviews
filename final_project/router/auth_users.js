const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    if(username && username!= ""){
        let user = users.find(u => u.username == username)
        if(!user)
            return true
    }
    return false
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let user = users.find(u => (u.username == username && u.password == password))
    if(user)
        return true
    else 
        return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username ,password} = req.body
    if(!username || !password)
        return res.status(400).json({message:"Error logging in"})
    if(authenticatedUser(username,password))
    {
        let token = jwt.sign({username,password},'SECRET', {expiresIn: 60 * 60})
        req.session.authorization = {token, username}
        res.status(201).json({message:"logged in successfuly"})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn
    let review = req.query.review
    let username = req.user.username
    if (!review)
        return res.status(400).json({message:"Review is required"})
    if(!books[isbn])
        return res.status(404).json({message:"Book not found"})
    if(books[isbn].reviews[username])
    {
        delete(books[isbn].reviews[username])
        books[isbn].reviews[username] = review
        res.status(201).json({message:"Review updated successfuly"})
    }
    else
    {
        books[isbn].reviews[username] = review
        res.status(201).json({message:"Review created successfuly"})        
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn
    let username = req.user.username
    if(books[isbn])
    {
        if(books[isbn].reviews[username])
        {
            delete(books[isbn].reviews[username])
            res.status(204).json({message:"Deleted successfuly"})
        }else {
            return res.status(404).json({message:"No review found for username of " + username})
        }
    }else
    {
        return res.status(404).json({message:"Book not found"})
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
