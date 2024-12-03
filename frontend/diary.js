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
async function initializeDiary() {
    const selectedDate = localStorage.getItem('selectedDate');
    if (!selectedDate) {
        diaryDate.textContent = '_no date selected';
        switchToEditMode(); // Default to edit mode if no date is selected
        return;
    }

    const [year, month, day] = selectedDate.split('-');
    const formattedDate = new Date(year, month - 1, day).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    diaryDate.textContent = `_${formattedDate}`;

    try {
        const response = await fetch(`/diary/${selectedDate}`);
        const result = await response.json();

        if (result.success && result.entry) {
            diaryEntries[selectedDate] = result.entry;
            switchToViewMode(selectedDate); // Display in view mode
        } else {
            switchToEditMode(selectedDate); // Allow new entry creation
        }
    } catch (error) {
        console.error('Error loading diary entry:', error);
        switchToEditMode(selectedDate); // Default to edit mode if fetch fails
    }
}



/**
 * Switch to view mode
 */
function switchToViewMode(date) {
    diaryInput.classList.remove('hidden');
    diaryView.classList.add('hidden');
    saveButton.classList.remove('hidden'); // save button out and about

    if (date) {
        diaryInput.value = diaryEntries[date] || '';
    } else {
        diaryInput.value = '';
    }

    // the edit button is visible
    let editButton = document.getElementById('edit-button');
    if (!editButton) {
        editButton = document.createElement('button');
        editButton.id = 'edit-button';
        editButton.className = 'action-button';
        editButton.textContent = 'edit.';
        document.querySelector('.bottomright').appendChild(editButton);
    }

    editButton.classList.remove('hidden');
    editButton.addEventListener('click', () => {
        switchToEditMode(date);
        editButton.classList.add('hidden');
    });

    // updateee mode label
    const modeLabel = document.getElementById('mode-label');
    modeLabel.textContent = 'view mode';
    modeLabel.classList.remove('edit-mode');
    modeLabel.classList.add('view-mode');
}



/**
 * Switch to edit mode
 */
function switchToEditMode(date) {
    diaryInput.classList.remove('hidden');
    diaryView.classList.add('hidden');
    saveButton.classList.remove('hidden');

    // Load the diary content if editing an existing entry
    if (date) {
        diaryInput.value = diaryEntries[date] || '';
    } else {
        diaryInput.value = '';
    }

    const modeLabel = document.getElementById('mode-label');
    modeLabel.textContent = 'edit mode';
    modeLabel.classList.remove('view-mode');
    modeLabel.classList.add('edit-mode');
}

/**
 * Save diary entry into the local storaage
 */
saveButton.addEventListener('click', async () => {
    const selectedDate = localStorage.getItem('selectedDate');
    const content = diaryInput.value.trim();
    if (!selectedDate) {
        alert('no date selected.');
        return;
    }

    if (!content) {
        alert('diary entry cannot be empty.');
        return;
    }

    // save entry to backend
    try {
        const response = await fetch('/diary/save', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ date: selectedDate, content }),
        });
        const result = await response.json();

        if (result.success) {
            alert('diary entry saved!');
            diaryEntries[selectedDate] = content;
            switchToViewMode(selectedDate);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('error saving entry:', error);
    }

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

    const confirmed = confirm('r you sure you want to delete this entry?');
    if (confirmed) {
        delete diaryEntries[selectedDate];
        localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));

        diaryInput.value = '';
        diaryView.textContent = '';
        switchToEditMode();

        removeDotFromDay(selectedDate); // remove the dot in the weekly view 
    }
});

/**
 * Lock diary view
 */
lockButton.addEventListener('click', () => {
    const selectedDate = localStorage.getItem('selectedDate');

    if (!selectedDate) {
        alert('No date selected.');
        return;
    }

    // save before locking
    const content = diaryInput.value.trim();
    if (content) {
        diaryEntries[selectedDate] = content; // updating local entries
    }

    diaryInput.classList.add('hidden');
    diaryView.classList.add('hidden');
    saveButton.classList.add('hidden');
    
    // add a lock screen overlay
    const lockOverlay = document.createElement('div');
    lockOverlay.id = 'lock-overlay';
    lockOverlay.innerHTML = `<h2>_locked.</h2><p>${selectedDate}</p>`;
    document.body.appendChild(lockOverlay);


    // unlock by clicking the overlay
    lockOverlay.addEventListener('click', () => {
        lockOverlay.remove();
        switchToViewMode(selectedDate); // ret to view mode
    });
});


/**
 * add a dot to a day in the weekly view
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
