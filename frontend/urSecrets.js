
// start of urSecrets.js.

const form = document.getElementById('form');
const password = document.querySelector(".password-box");
const email = document.getElementsByClassName('email-box');
const error = document.getElementById('error')




form.addEventListener('submit', (e) => {
    let messages = []
    if (password.value.length <= 8) {
        messages.push('username must be at least 8 characters.')

    }
    if (password.value.length >= 15) {
        messages.push('username must be shorter than 15 characters.')

    }

    if (messages.length > 0) {
        e.preventDefault()
        error.innerText = messages.join(', ')
    }

});



















/* var myID; //global variable to store user ID - KEEP COMMENTED IN CASE OF FUTURE REFERENCE
var guessWord; //global variable to store guesses as to the secret word

/** 
 *  Reset the game
 * 
 * @param {boolean} winner if the game ended because we won
 * @param {boolean} start if this is the first game

function resetGame( winner, start ) {

    if (winner && !start) alert("You win!");
    else if (!winner && !start) alert("You lose!");

    fetch( "http://localhost:3000/generateWord") //endpoint
        .then(res => res.text())
        .then(res => {
            console.log(res);
            res = JSON.parse(res);
            myID = res['userID']; //store our ID on the server
            var wordLen = res['len']; //length of the word
            document.getElementById("mistakes").textContent = "MISTAKES SO FAR: "; //no mistakes yet
            document.hangman.elements["guess"].value = ""; //nothing in the guess box
            guessWord = new Array(wordLen).fill("_ ");
            printGuess(); //print the current guess to the HTML
        });
}

/** 
 * Make a guess

async function makeGuess() {

    const request = {
        'userID': myID, 
        'letterGuess': document.hangman.elements["guess"].value, //the user's guess!
        'guessWord': guessWord
    };


    fetch('http://localhost:3000/makeGuess', { //call endpoint
        headers: {
            "Content-Type": "application/json",
        },
        method: 'POST', //POST request
        body: JSON.stringify(request)})
        .then(res => res.text())
        .then(res => {
            res = JSON.parse(res);
            evaluate(res);
            console.log(res);
        });
      
}

/** 
 * Print the current guess to the HTML.

function printGuess() {
    var guessArea = document.getElementById('guessarea');
    guessArea.textContent = guessWord.join('');

}

/** 
 * Clears the guess box in the DOM
 
function clearGuess() {
    document.hangman.elements["guess"].value = ""; //reset the guess box
}

/** 
 * updates the list of wrong letters in the DOM
 
function updateWrongLetters() {
    var guessedLetter = document.hangman.elements["guess"].value;
    //Add this letter to the letters in the HTML element with the ID "mistakes"  
    var wrongLetters = document.getElementById("mistakes");
    wrongLetters.textContent += guessedLetter + " ";
}


/** 
 * Decode the response from the server after making a guess.
 * 
 * @param {object} response the response object from the server.

function evaluate(response) {

    //retrieve info from the response
    //this includes the number of incorrect responses
    //and the updated state of the guess word
    var correct = response['correct'];
    var error_count = response['errors'];
    guessWord = response['guessWord']; //update the guessWord

    printGuess(); //print out the guess 

    //If the letter is NOT correct, we need to add it to the MISTAKES.
    if (!correct) {
        //Get the value in the HTML element with the ID "guess"
        updateWrongLetters();
    }

    clearGuess();

    //Check to see if you have a winner!
    //Cycle thru guessWord to see if every element is a LETTER
    var winner = guessWord.every(function (letter) {
        return letter !== "_ ";
    });

    //are we a winner?
    if (winner) {
        resetGame(winner, false); //Call 'resetGame(winner, false)' to start the game over
    }

    //are we a loser?
    //We are, if error_count is >= 6
    if (error_count >= 6) {
        resetGame(winner, false); //Call 'resetGame(winner, false)' to start the game over
    }
}
*/
