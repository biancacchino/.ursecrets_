const express = require('express'); //to run a server application
const fs = require("fs"); //to read and write to a file
const cors = require("cors"); //to get around cors issues.  browsers may restrict cross-origin HTTP requests initiated from scripts!
const bcrypt = require("bcrypt"); // password hashing.
const parser = require("body-parser"); // to manage requests
const path = require("path"); // for file paths
const session = require("express-session"); // keeps users logged in.

let pages = path.join(__dirname, '../frontend');



const app = express();
const port = 3000;

app.use(cors()); //manage cors headers
app.use(express.json()); //messages will be passed in JSON
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../frontend')));


//login page
app.get('/', (req, res) => {
    res.sendFile(path.join(pages, 'home.html'))
  
});

//create account
app.get('/create', (req, res) => {
    res.sendFile(path.join(pages, 'signup.html'))
  
});

//create account
app.get('/forgot', (req, res) => {
    res.sendFile(path.join(pages, 'forgot-pass.html'))
  
});

const users = []

app.post('/create', async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password,10)
        users.push({
            id: Date.now().toString(),
            user: req.body.username,
            password: hash,
        })
        console.log(users);
        res.redirect('/');
    } catch {
        console.log('error');
        res.redirect("/create");
    }   
});



app.post('/forgot', (req, res) => {
    const { username, password } = req.body;

    
    console.log('New User:', { username, password });

    // redirects to home page
    res.redirect('/');
});




//server start
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  }); 