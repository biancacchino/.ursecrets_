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
async function renderYears() {
    console.log("Rendering years...");
    const yearsList = document.querySelector('.years');
    yearsList.innerHTML = ''; // Clear previous content
    const currentYear = new Date().getFullYear();

    for (let year = currentYear - 2; year <= currentYear + 4; year++) {
        const yearItem = document.createElement('li');
        yearItem.textContent = year;

        // Fetch and log entries
        try {
            const res = await fetch(`/entries?year=${year}`);
            const data = await res.json();
            console.log(`Entries for ${year}:`, data);

            if (data.hasEntries) {
                yearItem.classList.add('has-entry');
            }
        } catch (err) {
            console.error(`Error fetching entries for year ${year}:`, err);
        }

        yearItem.addEventListener('click', () => {
            renderMonths(year);
            switchTab('monthly'); // Switch to the monthly view
        });

        yearsList.appendChild(yearItem);
    }
}


// Render months dynamically
async function renderYears() {
    console.log("Rendering years...");
    const yearsList = document.querySelector('.years');
    yearsList.innerHTML = ''; // Clear previous content
    const currentYear = new Date().getFullYear();

    for (let year = currentYear - 2; year <= currentYear + 4; year++) {
        const yearItem = document.createElement('li');
        yearItem.textContent = year;

        // Fetch and log entries
        try {
            const res = await fetch(`/entries?year=${year}`);
            const data = await res.json();
            console.log(`Entries for ${year}:`, data);

            if (data.hasEntries) {
                yearItem.classList.add('has-entry');
            }
        } catch (err) {
            console.error(`Error fetching entries for year ${year}:`, err);
        }

        yearItem.addEventListener('click', () => {
            renderMonths(year);
            switchTab('monthly'); // Switch to the monthly view
        });

        yearsList.appendChild(yearItem);
    }
}
function renderMonths(year) {
    const monthsList = document.querySelector('.months');
    monthsList.innerHTML = ''; // Clear previous content

    const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];

    // loopin through the months array and render each month
    months.forEach((month, index) => {
        const monthItem = document.createElement('li');
        monthItem.textContent = month;

        // checkin if the month has diary entries
        fetch(`/entries?year=${year}&month=${index + 1}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data.hasEntries) {
                    monthItem.classList.add('has-entry'); // add a visual indicator for entries
                }
            })
            .catch(err => {
                console.error(`Error fetching entries for ${year}-${index + 1}:`, err);
            });

        // add click event to render the weekly view for the first week of the month
        monthItem.addEventListener('click', () => {
            renderWeek(new Date(year, index, 1)); // start at the beginning of the month
            switchTab('weekly'); // switch to the weekly view
        });

        monthsList.appendChild(monthItem);
    });
}


// render a week
async function renderWeek(startDate) {
    const daysList = document.querySelector('.days');
    const weekHeader = document.querySelector('.current-date');
    daysList.innerHTML = ''; // Clear previous content

    const startOfWeek = new Date(startDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // start on Sunday

    // update week header
    weekHeader.textContent = `_week of ${startOfWeek.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    }).toLowerCase()}.`;

    // Fetch all entries
    let userEntries = {};
    try {
        const response = await fetch('/diary/all');
        const result = await response.json();
        if (result.success) {
            userEntries = result.entries;
        }
    } catch (error) {
        console.error('Error fetching entries:', error);
    }

    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);

        const dayItem = document.createElement('li');
        dayItem.textContent = day.getDate();
        dayItem.classList.add('day');

        const formattedDate = day.toISOString().split('T')[0]; // format: yyyy-mm-dd

        // add dot if the date has entries
        if (userEntries[formattedDate]) {
            const dot = document.createElement('span');
            dot.className = 'entry-indicator';
            dot.textContent = '•';
            dayItem.appendChild(dot);
        }

        // redirect to diary entry page
        dayItem.addEventListener('click', () => {
            localStorage.setItem('selectedDate', formattedDate); // save selected date
            window.location.href = 'diary-entry.html'; // redirect
        });

        daysList.appendChild(dayItem);
    }

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


//logout functionality
document.getElementById("logout-button").addEventListener("click", async () => {
    const response = await fetch('/logout', { method: 'DELETE' });
    if (response.redirected) {
        window.location.href = response.url;
    }
});