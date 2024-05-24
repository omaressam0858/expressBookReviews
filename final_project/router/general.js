const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let axios = require('axios')
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const {username,password} = req.body
    if(isValid(username))
    {
        users.push({username,password})
        res.status(201).json({username, password})

    }else{
        res.status(400).json({message:"Invalid username"})
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.json(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn
    let book = books[isbn]
    res.json(book)
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let queried_books = {}
    let author = req.params.author
    for(let [key,value] of Object.entries(books))
    {
        if(value.author == author)
        queried_books[key] = value
    }
    return res.json(queried_books)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let queried_books = {}
    let title = req.params.title
    for(let [key,value] of Object.entries(books))
    {
        if(value.title == title)
        queried_books[key] = value
    }
    return res.json(queried_books)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn
    let book = books[isbn]
    if (!book)
        return res.status(404).json({message:"Not Found"})
    res.json(book.reviews)
});


// tasks 10 - 13

public_users.get('/books',async function(req,res) {
    try
    {
        let response = await axios.get('http://localhost:5000/')
        res.json(response.data)
    }catch(error)
    {
        console.log(error)
        res.status(500).json({message:'error occured'})
    }
})


public_users.get('/books/isbn/:isbn',async function(req,res) {
    let isbn = req.params.isbn
    try
    {
        let response = await axios.get('http://localhost:5000/isbn/'+isbn)
        res.json(response.data)
    }catch(error)
    {
        console.log(error)
        res.status(500).json({message:'error occured'})
    }
})

public_users.get('/books/author/:author',async function(req,res) {
    let author = req.params.author
    try
    {
        let response = await axios.get('http://localhost:5000/author/'+author)
        res.json(response.data)
    }catch(error)
    {
        console.log(error)
        res.status(500).json({message:'error occured'})
    }
})

public_users.get('/books/title/:title',async function(req,res) {
    let title = req.params.title
    try
    {
        let response = await axios.get('http://localhost:5000/title/'+title)
        res.json(response.data)
    }catch(error)
    {
        console.log(error)
        res.status(500).json({message:'error occured'})
    }
})

module.exports.general = public_users;
