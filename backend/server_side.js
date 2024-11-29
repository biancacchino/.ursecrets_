const express = require('express'); //to run a server application
const fs = require("fs"); //to read and write to a file
const cors = require("cors"); //to get around cors issues.  browsers may restrict cross-origin HTTP requests initiated from scripts!


const app = express();
const port = 3000;

app.use(cors()); //manage cors headers
app.use(express.json()); //messages will be passed in JSON
app.use(express.urlencoded({ extended: true }));

// server start
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  }); 


const users = {}