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
const methodOverride = require("method-override")




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
app.get('/', checkNotAuth, (req, res) => {
    res.sendFile(path.join(pages, 'home.html'))
  
});


//create account
app.get('/create', checkNotAuth, (req, res) => {
    res.sendFile(path.join(pages, 'signup.html'))
  
});

//year selection
app.get('/years', checkAuth, (req, res) => {
    res.sendFile(path.join(pages, 'yearSelection.html'))
  
});

//error message
app.get('/error', (req, res) => {
    res.sendFile(path.join(pages, 'error.html'))
  
});

//emoji page
app.get('/mood', checkNotAuth, (req, res) => {
    res.sendFile(path.join(pages, 'emoji.html'))
  
});

//logout page
app.get('/logout', checkNotAuth, (req, res) => {
    res.sendFile(path.join(pages, 'logout.html'))
  
});



const users = []

app.post('/create', checkNotAuth, async (req, res) => {
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



app.post("/", checkNotAuth, passport.authenticate("local", {
    successRedirect: "/years",
    failureRedirect: "/error",
    failureFlash: true,
}))


//logout enpoint
app.delete("/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err)
        res.redirect("/")
    })
})


//if user is not logged in they cannot navigate to other pages.
function checkAuth(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/")
}

function checkNotAuth(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect("/years")
    }
    next()
}
// storing diary entries in memory w userid
const diaryEntries = {}; 
/**
 * saving a diary using POST
 * 
 */
app.post('/diary/save', checkAuth, (req,res) => {
    const userID = req.userID; // get userid from sesh
    const {date, content} = req.body;

    if (!diaryEntries[userID]) {
        diaryEntries[userID] = {};
    }
    diaryEntries[userID][date] = content; // saves entry
    res.json({success: true, message: 'diary entry saved successfully'});
});

/**
 * getting diary entry by date
 */
app.post('/diary/:date', checkAuth, (req, res) => {
    const userID = req.user.userID;
    const date = req.params.date;

    const userEntries = diaryEntries[userID] || {};
    const entry = userEntries[date];

    if (entry) {
        res.json({sucess: true, entry});
    } else {
        res.json({success: false, message: 'no entry for this date.'})
    }
});

/**
 * get all entries
 */
app.get('/diary/all', checkAuth, (req,res) => {
    const userID = req.user.userID;
    const userEntries = diaryEntries[userID] || {};

    res.json({success: true, entries: userEntries });
});

//server start
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  }); 

//export { checkAuth, checkNotAuth }