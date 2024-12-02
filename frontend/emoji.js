document.addEventListener('DOMContentLoaded', () => {
   const emojiPicker = document.getElementById('emoji-picker');
   const saveEntryButton = document.getElementById('save-entry');
   const timeRangeSelector = document.getElementById('time-range');
   const filterChartButton = document.getElementById('filter-chart');
   const moodChartCanvas = document.getElementById('moodChart').getContext('2d');

   const entries = [];
   let moodChart;


   // Save entry and render to the container
   saveEntryButton.addEventListener('click', () => {
       const selectedEmoji = emojiPicker.value;
       if (!selectedEmoji) {
           alert('Please select an emoji!');
           return;
       }

       const entry = { emoji: selectedEmoji, date: new Date() };
       entries.push(entry);

       // Render entry
       const entryDiv = document.createElement('div');
       entryDiv.textContent = `${entry.date.toDateString()}: ${entry.emoji}`;
       entriesContainer.appendChild(entryDiv);
   });

   
   filterChartButton.addEventListener('click', () => {
       const timeRange = timeRangeSelector.value;

       // Filter entries based on time range and update chart data
       const filteredEntries = filterEntriesByTimeRange(entries, timeRange);


      
    const moodCounts = {};
    filteredEntries.forEach(entry => {
        moodCounts[entry.emoji] = (moodCounts[entry.emoji] || 0) + 1;
    });

    //data for the chart
    const labels = Object.keys(moodCounts);
    const data = Object.values(moodCounts); 
    const totalEntries = data.reduce((sum, count) => sum + count, 0); // Calculate total entries

     // Check if any emoji exceeds 50% of total entries
     const dominantEmojiIndex = data.findIndex(count => (count / totalEntries) > 0.5);
     const moodMessage = document.getElementById('mood-message');

     if (dominantEmojiIndex !== -1) {
        const dominantEmoji = labels[dominantEmojiIndex];
        const moodDescriptions = {
            '😀': 'happy',
            '😔': 'sad',
            '😡': 'angry',
            '😌': 'relaxed',
            '🤪': 'playful',
            '😟': 'stressed',
        };

        const moodText = moodDescriptions[dominantEmoji] || 'a particular way';
        moodMessage.textContent = `You've been feeling quite ${moodText} lately!`;
    } else {
        moodMessage.textContent = ''; // Clear message if no dominant mood
    }

    if (moodChart) {
        moodChart.destroy();
    }


       // making the pie chart
       moodChart = new Chart(moodChartCanvas, {
        type: 'pie',
        data: {
            labels: labels, // Emojis
            datasets: [{
                data: data, // Counts
                backgroundColor: generateColors(labels.length) // Random colors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.raw;
                            const percentage = ((value / totalEntries) * 100).toFixed(2);
                            return `${label}: ${percentage}% (${value})`;
                        }
                    }
                },
                legend: {
                    position: 'top'
                }
            }
        }
    });
});


function filterEntriesByTimeRange(entries, timeRange) {
    const now = new Date(); 

    let startDate;
    if (timeRange === 'week') {
        const dayOfWeek = now.getDay();
        startDate = new Date(now.setDate(now.getDate() - dayOfWeek)); // Start of the week
    } else if (timeRange === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the month
    } else if (timeRange === 'year') {
        startDate = new Date(now.getFullYear(), 0, 1); // Start of the year
    } else {
        return entries; // Return all entries if time range is invalid
    }


    // Filter entries based on the start date
    return entries.filter(entry => entry.date >= startDate);
}

//Adding colors


function generateColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const hue = Math.floor(Math.random() * 360);
        colors.push(`hsl(${hue}, 70%, 70%)`);
    }
    return colors;
}
});

// Event listener to update the chart based on time range
document.getElementById('filter-chart').addEventListener('click', loadEntries);

// Load the initial chart
loadEntries();