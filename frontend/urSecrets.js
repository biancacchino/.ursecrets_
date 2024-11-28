
// start of urSecrets.js.

const form = document.getElementById('form');
const password = document.getElementsByClassName("password-box");
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

document.addEventListener("DOMContentLoaded", function () {
    initializeYearSelection();
});

function initializeYearSelection() {
    setupTabs();
    renderYears();
}

function setupTabs() {
    const tabs = document.querySelectorAll(".tab");
    const views = document.querySelectorAll(".view");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Show corresponding view
            const targetView = tab.getAttribute("data-view");
            views.forEach(view => {
                if (view.id === targetView) {
                    view.classList.remove("hidden");
                } else {
                    view.classList.add("hidden");
                }
            });
        });
    });
}
/**
 * > yearSelection
 * 
 */
function renderYears() {
    const currentYear = new Date().getFullYear();
    const yearsList = document.querySelector(".years");

    for (let year = currentYear - 2; year <= currentYear + 4; year++) {
        const yearItem = document.createElement("li");
        yearItem.textContent = year;
        yearItem.dataset.entry = false; // Default no entry indicator

        // Check for entries (replace with actual API call)
        fetch(`/entries?year=${year}`)
            .then(res => res.json())
            .then(data => {
                if (data.hasEntries) {
                    yearItem.dataset.entry = true;
                }
            });

        yearItem.addEventListener("click", () => {
            renderMonths(year);
        });

        yearsList.appendChild(yearItem);
    }
}
/**
 * Function for yearSelection page
 * 
 * 
 * @param {} year 
 */
function renderMonths(year) {
    switchTabs("monthly");
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthsList = document.querySelector(".months");
    monthsList.innerHTML = ""; // Clear previous months

    months.forEach((month, index) => {
        const monthItem = document.createElement("li");
        monthItem.textContent = month;
        monthItem.dataset.entry = false;

        // Check for entries (replace with actual API call)
        fetch(`/entries?year=${year}&month=${index + 1}`)
            .then(res => res.json())
            .then(data => {
                if (data.hasEntries) {
                    monthItem.dataset.entry = true;
                }
            });

        monthItem.addEventListener("click", () => {
            renderDays(year, index + 1);
        });

        monthsList.appendChild(monthItem);
    });
}

function renderDays(year, month) {
    switchTabs("weekly");
    const daysList = document.querySelector(".days");
    const currentDate = document.querySelector(".current-date");
    const daysInMonth = new Date(year, month, 0).getDate(); // Total days in the month

    currentDate.textContent = `${month}/${year}`;
    daysList.innerHTML = ""; // Clear previous days

    for (let day = 1; day <= daysInMonth; day++) {
        const dayItem = document.createElement("li");
        dayItem.textContent = day;
        dayItem.dataset.entry = false;

        // Check for entries (replace with actual API call)
        fetch(`/entries?year=${year}&month=${month}&day=${day}`)
            .then(res => res.json())
            .then(data => {
                if (data.hasEntries) {
                    dayItem.dataset.entry = true;
                }
            });

        daysList.appendChild(dayItem);
    }
}
/**
 * function for yearSelection page
 * Switching Tabs and makes it hidden or active depending on what the user 
 * 
 * @param {*} viewId 
 */
function switchTabs(viewId) {
    const tabs = document.querySelectorAll(".tab");
    const views = document.querySelectorAll(".view");

    tabs.forEach(tab => {
        tab.classList.remove("active");
        if (tab.getAttribute("data-view") === viewId) {
            tab.classList.add("active");
        }
    });

    views.forEach(view => {
        if (view.id === viewId) {
            view.classList.remove("hidden");
        } else {
            view.classList.add("hidden");
        }
    });
}





























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
