if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config()
}

//must download these modules in order for server run.
const express = require('express'); //to run a server application
const cors = require("cors"); //to get around cors issues.  browsers may restrict cross-origin HTTP requests initiated from scripts!
const bcrypt = require("bcrypt"); // password hashing.
const path = require("path"); // for file paths
const session = require("express-session"); // keeps users logged in.
const initPassport = require("./passport-config")
const flash = require("express-flash");
const passport = require('passport');


initPassport(
    passport,
    userID => users.find(user => user.userID === userID),
    id => users.find(user => user.id === id )
)


let pages = path.join(__dirname, '../frontend');



const app = express();
const port = 3000;

app.use(cors()); //manage cors headers
app.use(express.json()); //messages will be passed in JSON
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(flash());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false, // no session variable if nothing is changed
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//login page
app.get('/', checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(pages, 'home.html'))
  
});


//create account
app.get('/create', checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(pages, 'signup.html'))
  
});

//year selection
app.get('/years', checkAuthenticated, (req, res) => {
    res.sendFile(path.join(pages, 'yearSelection.html'))
  
});

//error message
app.get('/error', (req, res) => {
    res.sendFile(path.join(pages, 'error.html'))
  
});

//emoji page
app.get('/mood', checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(pages, 'emoji.html'))
  
});


const users = []

app.post('/create', checkNotAuthenticated, async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password,10)
        users.push({
            id: Date.now().toString(),
            userID: req.body.userID,
            password: hash,
        })
        console.log(users);
        res.redirect('/');
    } catch (error){
        console.log('error');
        res.redirect("/create");
    }   
});



app.post("/", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/years",
    failureRedirect: "/error",
    failureFlash: true,
}))

//if user is not logged in they cannot navigate to other pages.
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/")
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect("/years")
    }
    next()
}





//server start
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  }); 
