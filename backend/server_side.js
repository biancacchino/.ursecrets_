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

/*app.use(cors()); //manage cors headers
app.use(express.json()); //messages will be passed in JSON
app.use(express.urlencoded({ extended: true }));*/

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(pages, 'home.html'))
  
})


//server start
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  }); 

const users = {}



/*app.post('/create', async (req, res) => {
    const { password } = req.body;

    if (users[username]) {
        return res.status(400).send('User already exists!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = { password: hashedPassword };

    res.redirect('/login.html');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users[username];

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid username or password!');
    }

    req.session.userId = username;
    res.redirect('/dashboard.html');
});*/
