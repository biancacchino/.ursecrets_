document.getElementById('save-entry').addEventListener('click', () => {
   const emoji = document.getElementById('emoji-picker').value;
   const diaryText = document.getElementById('diary-text').value;

   const entry = {
       date: new Date().toISOString(),
       text: diaryText,
       emoji: emoji
   };

  
   let diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
   diaryEntries.push(entry);
   localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
   alert('Entry Saved!');
});
