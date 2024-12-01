
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
/**
 * yearSelection.html stuff
 */
function initializeYearSelection() {
    setupTabs();
    renderYears(); // defaults to yearly page
}

/**
 * 
 */
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const views = document.querySelectorAll('.view');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // remoce active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));

            // add active class to the clicked tab
            tab.classList.add('active');

            // show the corresponding view
            const targetView = tab.getAttribute('data-view');
            views.forEach(view => {
                view.classList.add('hidden'); // hide all views
                if (view.id === targetView) {
                    view.classList.remove('hidden'); // show the target view
                }
            });

            // load the appropriate content
            if (targetView === 'yearly') {
                renderYears();
            } else if (targetView === 'monthly') {
                // assume a default year for the first render
                renderMonths(new Date().getFullYear());
            } else if (targetView === 'weekly') {
                // assume the current week for the first render
                renderWeek(new Date());
            }
        });
    });
}

/**
 * renders the years
 */
function renderYears() {
    const yearsList = document.querySelector('.years');
    yearsList.innerHTML = ''; // remove remove remove previoi=us stuff on screen
    const currentYear = new Date().getFullYear();

    for (let year = currentYear - 2; year <= currentYear + 4; year++) {
        const yearItem = document.createElement('li');
        yearItem.textContent = year;

        // check if year has entries
        fetch(`/entries?year=${year}`)
            .then(res => res.json())
            .then(data => {
                if (data.hasEntries) {
                    yearItem.classList.add('has-entry');
                }
            });

        yearItem.addEventListener('click', () => {
            renderMonths(year);
            switchTab('monthly'); // switch to the monthly view
        });

        yearsList.appendChild(yearItem);
    }
}

// Render months dynamically
function renderMonths(year) {
    const monthsList = document.querySelector('.months');
    monthsList.innerHTML = ''; // Clear previous content
    const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];

    months.forEach((month, index) => {
        const monthItem = document.createElement('li');
        monthItem.textContent = month;

        // Check if month has entries
        fetch(`/entries?year=${year}&month=${index + 1}`) // start at the first month
            .then(res => res.json())
            .then(data => {
                if (data.hasEntries) {
                    monthItem.classList.add('has-entry');
                }
            });

        monthItem.addEventListener('click', () => {
            renderWeek(new Date(year, index+1));
            switchTab('weekly'); // switch to the weekly view
        });

        monthsList.appendChild(monthItem);
    });
}

// render a week
function renderWeek(startDate) {
    const daysList = document.querySelector('.days');
    const weekHeader = document.querySelector('.current-date');
    daysList.innerHTML = ''; // clear previous content

    const startOfWeek = new Date(startDate);
    startOfWeek.setDate(startDate.getDate() - startDate.getDay()); // start on sunday

    // uses toLocaleDateString and uses a dictionary to extract certain parts of the date
    weekHeader.textContent = `_${startOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric'}).toLowerCase()}.`;
    

    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);

        const dayItem = document.createElement('li');
        dayItem.textContent = day.getDate();
        dayItem.classList.add('day');

        // check if day has entries
        fetch(`/entries?year=${day.getFullYear()}&month=${day.getMonth() + 1}&day=${day.getDate()}`)
            .then(res => res.json())
            .then(data => {
                if (data.hasEntries) {
                    dayItem.classList.add('has-entry');
                }
            });

        daysList.appendChild(dayItem);
    }

    // add navigation
    addWeekNavigation(startOfWeek);
}

/**
 * logic for prev and next week btns
 * @param {} startOfWeek 
 */
function addWeekNavigation(startOfWeek) {
    const prevWeekButton = document.getElementById('prev-week');
    const nextWeekButton = document.getElementById('next-week');

    prevWeekButton.onclick = () => renderWeek(new Date(startOfWeek.setDate(startOfWeek.getDate() - 7))); // go back 7 days
    nextWeekButton.onclick = () => renderWeek(new Date(startOfWeek.setDate(startOfWeek.getDate() + 7))); // go fwd 7 days
}

// to switch tabs
function switchTab(viewId) {
    document.querySelectorAll('.view').forEach(view => view.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
}

// to switch to a specific tab by its ID
function switchTab(viewId) {
    const tabs = document.querySelectorAll('.tab');
    const views = document.querySelectorAll('.view');

    tabs.forEach(tab => {
        if (tab.getAttribute('data-view') === viewId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    views.forEach(view => {
        if (view.id === viewId) {
            view.classList.remove('hidden');
        } else {
            view.classList.add('hidden');
        }
    });
}

/**
 * diary-entry.html
 * i hate this shit so much i wanna kill myself
 * 
 * DOM ELEMENTS
 */

// storage?
let diaryEntries = JSON.parse(localStorage.getItem('diaryEntries'));
// buttons
const lockButton = document.getElementById('lock-button');
const trashButton = document.getElementById('trash-button');
const saveButton = document.getElementById('save-button');
// allat
const diaryInput = document.getElementById('diary-input');
const diaryView = document.getElementById('diary-view');
const diaryContent = document.getElementById('diary-content');
// do i even have to comment this?
const diaryDate = document.getElementById('diary-date');

/**
 * initialize the diary page
 */
function initDiary() {
    const selectedDate = localStorage.getItem('selectedDate');
    if (!selectedDate) {
        diaryDate.textContent = '_no date selected.';
        return;
    }

    const [year,month,day] = selectedDate.split(' ');
    const formattedDate = new Date(year, month - 1, day).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
    });

    diaryDate.textContent = `_${formattedDate}`;

    if (diaryEntries[selectedDate]) {
        diaryViewMode(selectedDate);
    } else {
        diaryEditMode();
    }
}

/**
 * view mode
 */
function diaryViewMode(date) {
    diaryInput.classList.add('hidden');
    diaryView.textContent = diaryEntries[date];
    diaryView.classList.remove('hidden');
    saveButton.classList.add('hidden');

    const editButton = document.createElement('button');
    editButton.id = 'edit-button';
    editButton.className = 'action-button';
    editButton.textContent = 'edit.';
    document.querySelector('.bottomright').appendChild(editButton);

    editButton.addEventListener('click', () => {
        diaryEditMode(date);
        editButton.remove();
    });
}

/**
 * edit mode
 */
function diaryEditMode(date) {
    diaryInput.classList.remove('hidden');
    diaryView.classList.add('hidden');
    saveButton.classList.remove('hidden');

    if (date) { // if there is a date 
        diaryInput.value = diaryEntries[date]; // give me date yayy
    } else {
        diaryInput.value = ''; // new new new new new enw
    }
}

/**
 * save diary gang
 */
saveButton.addEventListener('click', () => {
    const selectedDate = localStorage.getItem('selectedDate');
    if (!selectedDate) {
        alert('no date selected buddy.');
        return;
    }
    const content = diaryInput.value.trim();
    if (!content) {
        alert('diary entry cannot be empty.');
        return;
    }
    // save to storages
    diaryEntries[selectedDate] = content;
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
    
    diaryViewMode(selectedDate);
    addDotDay(selectedDate);
});

/**
 * trash
 */
trashButton.addEventListener('click', () => {
    const selectedDate = localStorage.getItem('selectedDate');
    if (!selectedDate) {
        alert('no date selected buddy.');
    }
})





















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
