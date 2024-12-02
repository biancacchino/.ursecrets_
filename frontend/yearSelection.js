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
                    const dot = document.createElement('span');
                    dot.className = 'entry-indicator';
                    dot.textContent = '•';
                    monthItem.appendChild(dot);
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
    daysList.innerHTML = ''; // Clear previous content

    const startOfWeek = new Date(startDate);
    startOfWeek.setDate(startDate.getDate() - startDate.getDay()); // start on Sunday

    // Update the week header
    weekHeader.textContent = `_${startOfWeek.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    }).toLowerCase()}.`;

    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);

        const dayItem = document.createElement('li');
        dayItem.textContent = day.getDate();
        dayItem.classList.add('day');

        const formattedDate = day.toISOString().split('T')[0]; // Format: yyyy-mm-dd

        // Add a dot if the date has entries
        fetch(`/entries?year=${day.getFullYear()}&month=${day.getMonth() + 1}&day=${day.getDate()}`)
            .then(res => res.json())
            .then(data => {
                if (data.hasEntries) {
                    const dot = document.createElement('span');
                    dot.className = 'entry-indicator';
                    dot.textContent = '•';
                    dayItem.appendChild(dot);
                }
            });

        // Add click event to redirect to diary.html with the selected date
        dayItem.addEventListener('click', () => {
            localStorage.setItem('selectedDate', formattedDate); // Save date in localStorage
            window.location.href = 'diary-entry.html'; // Redirect to diary.html
        });

        daysList.appendChild(dayItem);
    }

    // Add navigation for weeks
    addWeekNavigation(startOfWeek);
    document.addEventListener('DOMContentLoaded', () => {
        const storedStartDate = localStorage.getItem('weeklyStartDate');
        if (storedStartDate) {
            renderWeek(new Date(storedStartDate)); // Load the stored start of the week
            localStorage.removeItem('weeklyStartDate'); // Clear it after rendering
        } else {
            renderWeek(new Date()); // Default to current week
        }
    });
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