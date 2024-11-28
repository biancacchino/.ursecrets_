const express = require('express'); //to run a server application
const fs = require("fs"); //to read and write to a file
const cors = require("cors"); //to get around cors issues.  browsers may restrict cross-origin HTTP requests initiated from scripts!


const app = express();
const port = 3000;

app.use(cors()); //manage cors headers
app.use(express.json()); //messages will be passed in JSON
app.use(express.urlencoded({ extended: true }));

// ENDPOINT EXAMPLES WITH FILE I/O

// GET ENDPOINTS
/** 
* example route
*/
app.get('/', (req, res) => {
  res.send('Hello World!');
})

/** 
* example route
*/
app.get('/myroute', (req, res) => {
    res.send('You can put code for a different route here!');
  })

/** 
* read from a file (get endpoint)
*/
app.get('/readfile', (req, res) => {
    fs.readFile("myFile.txt", function (err, data) {
        if (err && err.code === 'ENOENT') {
            res.send('No file exists!');
        } else {
            res.send('Data read: ' + data.toString());
        }
    });   
});

/** 
* writefile to a file (get endpoint)
*/
app.get('/writefile', (req, res) => {
    fs.appendFile( "myFile.txt", "Let's write a few sentences in the file!\n",
        function (err) {
            if (err) {
                return console.error(err);
            }
            // If no error the remaining code executes
            res.send('Wrote a line to a file on the server!');
        }   
    );

})






































/* GAME IMPLEMENTATION - keep commented incase of need for future reference!

//for the game implementation
var idCounter = 0; //a global user ID couunter; each user has a unique ID
var gameInfo = {}; //store game information for each user

// GET ENDPOINTS
/** 
* generate a word (get endpoint)
*/
/*app.get('/generateWord', (req, res) => {
    //generate a word and ID for this user
    
    var userID = idCounter++;
    generateWord(userID);

    // prepare the response
    var jsontext = JSON.stringify({
          'action': 'generateWord',
          'userID': userID,
          'len': gameInfo[userID][0].length,
          'msg': 'New word generated!!!'
    });

    // send the response to the client	
    res.send(jsontext);
})

// POST ENDPOINTS
/** 
* Make a guess (post endpoint)

app.post('/makeGuess', (req, res) => {

    //generate a word and ID for this user    
    console.log("Query received: ");
    console.log(req.body);

    var [correct, num_errors, attemptWord] = makeGuess(req.body.userID, req.body.letterGuess, req.body.guessWord);

    // prepare the response
    var jsontext = JSON.stringify({
        'correct': correct,
        'errors': num_errors,
        'guessWord': attemptWord
    });

    // send the response to the client	
    res.send(jsontext);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


/** 
* Generatea a secret word for this client
* secret word and error count is stored in global variable (gameInfo)
*
* @param {number} clientID

function generateWord(clientID) {

    var possibleWords = [
        ["R", "A", "D", "I", "O"],
        ["T", "E", "A", "M", "W", "O", "R", "K"],
        ["W", "E", "B", "D", "E", "S", "I", "G", "N"],
        ["E", "D", "U", "C", "A", "T", "I", "O", "N"],
        ["C", "H", "O", "C", "O", "L", "A", "T", "E"],
        ["U", "N", "I", "V", "E", "R", "S", "I", "T", "Y"]
        //add more words if you like.
    ]
  
    //generate word
    var index = Math.floor(Math.random() * possibleWords.length); //... Finish this line!! Select an element from possibleWords at random.
  
    gameInfo[clientID] = [possibleWords[index], 0]; //store the secret word and error count for this user!
  }



/** 
* Evauate a client's guess
* The function returns an array: [correct, num_errors, attemptWord]
* correct is a BOOLEAN that indicates if the user's guess is correct
* num_errors is count of the user's ERRORS thus far
* attemptWord is an updated record of the client's current progress on the word
* @param {number} userID 
* @param {string} letterGuess 
* @param {string} attemptWord 
* @return {object} array containing a BOOLEAN, a NUMBER, and attemptWord (an array)

function makeGuess(inputID, letterGuess, attemptWord) {
  
    var input = gameInfo[inputID]; //get game info for this user
    var secretWord = input[0];
    var num_errors = input[1];
  
    var correct = false;
  
    //Assess if and where letterGuess appears in the secret word
    //If it appears in the word, update the ltters within 
    //attemptWord accordingly.
    for (var i = 0; i < secretWord.length; i++) {
        if (secretWord[i] === letterGuess) {
            attemptWord[i] = letterGuess;
            correct = true;
        }
    }
  
    //if letterGuess does not exist in word, update errors
    if (!correct) {
        num_errors += 1;
        gameInfo[inputID][1] = num_errors;
    }
  
    return [correct, num_errors, attemptWord];
  }
  
// ADD THE LINE BELOW TO RUN TESTS
//  export { generateWord, makeGuess, gameInfo } */