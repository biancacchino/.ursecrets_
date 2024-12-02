// In-memory storage for diary entries (or use backend/localStorage for persistence)
let diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || {};

// DOM Elements
const diaryDate = document.getElementById('diary-date');
const diaryInput = document.getElementById('diary-input');
const diaryView = document.getElementById('diary-view');
const saveButton = document.getElementById('save-button');
const trashButton = document.getElementById('trash-button');
const lockButton = document.getElementById('lock-button');

/**
 * Initialize the diary page
 */
function initializeDiary() {
    const selectedDate = localStorage.getItem('selectedDate'); // Date from yearSelection
    if (!selectedDate) {
        diaryDate.textContent = '_no date selected';
        return;
    }

    const [year, month, day] = selectedDate.split('-');
    const formattedDate = new Date(year, month - 1, day).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    diaryDate.textContent = `_${formattedDate}`;

    // Check if there is an existing entry
    if (diaryEntries[selectedDate]) {
        switchToViewMode(selectedDate);
    } else {
        switchToEditMode();
    }
}

/**
 * Switch to view mode
 */
function switchToViewMode(date) {
    diaryInput.classList.add('hidden');
    diaryView.textContent = diaryEntries[date];
    diaryView.classList.remove('hidden');
    saveButton.classList.add('hidden');

    // Replace save button with edit button
    const editButton = document.createElement('button');
    editButton.id = 'edit-button';
    editButton.className = 'action-button';
    editButton.textContent = 'edit.';
    document.querySelector('.bottomright').appendChild(editButton);

    editButton.addEventListener('click', () => {
        switchToEditMode(date);
        editButton.remove(); // Remove the edit button
    });
}

/**
 * Switch to edit mode
 */
function switchToEditMode(date) {
    diaryInput.classList.remove('hidden');
    diaryView.classList.add('hidden');
    saveButton.classList.remove('hidden');

    if (date) {
        diaryInput.value = diaryEntries[date] || ''; // Load existing entry
    } else {
        diaryInput.value = ''; // New entry
    }
}

/**
 * Save diary entry
 */
saveButton.addEventListener('click', () => {
    const selectedDate = localStorage.getItem('selectedDate');
    if (!selectedDate) {
        alert('No date selected.');
        return;
    }

    const content = diaryInput.value.trim();
    if (!content) {
        alert('Diary entry cannot be empty.');
        return;
    }

    // Save entry
    diaryEntries[selectedDate] = content;
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));

    switchToViewMode(selectedDate);
    addDotToDay(selectedDate); // Add a dot in the weekly view
});

/**
 * Delete diary entry
 */
trashButton.addEventListener('click', () => {
    const selectedDate = localStorage.getItem('selectedDate');
    if (!selectedDate) {
        alert('No date selected.');
        return;
    }

    const confirmed = confirm('Are you sure you want to delete this entry?');
    if (confirmed) {
        delete diaryEntries[selectedDate];
        localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));

        diaryInput.value = '';
        diaryView.textContent = '';
        switchToEditMode();

        removeDotFromDay(selectedDate); // Remove the dot in the weekly view
    }
});

/**
 * Lock diary view
 */
lockButton.addEventListener('click', () => {
    const confirmed = confirm('Do you want to lock this diary?');
    if (confirmed) {
        document.body.innerHTML = `
            <div id="lock-screen" style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: var(--dark);
                color: var(--background);
                font-family: var(--font-main);
                text-align: center;
                flex-direction: column;">
                <h1>🔒 Diary Locked</h1>
                <p>Click the button below to unlock</p>
                <button id="unlock-button" style="
                    background: var(--lightdark);
                    color: var(--background);
                    border: none;
                    padding: 10px 20px;
                    font-size: 18px;
                    cursor: pointer;
                    border-radius: 4px;
                    text-transform: lowercase;
                ">Unlock</button>
            </div>
        `;

        document.getElementById('unlock-button').addEventListener('click', () => {
            location.reload(); // Reload the page
        });
    }
});

/**
 * Add a dot to a day in the weekly view
 */
function addDotToDay(date) {
    const [year, month, day] = date.split('-');
    const dayElement = Array.from(document.querySelectorAll('.days li')).find(
        (li) => li.textContent === String(parseInt(day, 10))
    );

    if (dayElement && !dayElement.querySelector('.entry-indicator')) {
        const dot = document.createElement('span');
        dot.className = 'entry-indicator';
        dot.textContent = '•';
        dayElement.appendChild(dot);
    }
}

/**
 * Remove a dot from a day in the weekly view
 */
function removeDotFromDay(date) {
    const [year, month, day] = date.split('-');
    const dayElement = Array.from(document.querySelectorAll('.days li')).find(
        (li) => li.textContent === String(parseInt(day, 10))
    );

    if (dayElement) {
        const dot = dayElement.querySelector('.entry-indicator');
        if (dot) dot.remove();
    }
}

// Initialize the diary on page load
document.addEventListener('DOMContentLoaded', initializeDiary);
