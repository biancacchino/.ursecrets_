# _ursecrets. 

a minimalistic diary for ur secrets. eecs 1012 fall 2024 @ york university.

## Description

server side code includes endpoints that interact with files, as well as
endpoints to support diary entries.

### Dependencies

Requires the JS express, fs and cors packages.  

### Installing
```
npm i cors
npm i fs
npm i express
npm i bcrypt
npm i dotenv
npm i express-session
npm i express-flash
npm i passport
npm i passport-local
npm i method-override
```
### Executing program

to start the server, cd into the backend folder and type
```
cd backend
node server_side.js
```

server will run by default at http://localhost:3000/.

# Users Stories:
### Zainab
- As a user, I want to add a Calander that displays months and years so that I can look back and revisit on my diary entries over the long term  
- As a user I want to add an emoji of the day feature so that I can visualize my emotional journey better while scrolling through my entries 
- As a user I want to add a graph of my “emoji of the day’s” so that I can statistically see my mood journey through a specific week, month, or year
- As a user, I want to add a quick save button so that I will not lose my progress while writing
- As a user, I want to add a notification bar so that it will remind me to write everyday


### Mariama
- As a user, I want the diary interface to be simple and clean so that I can focus on my writing without distractions.
- As a user, I want a lock button to quickly hide sensitive information so that I feel confident my diary is private.
- As a user, I want a trash button so that I can discard of irrelevant entries.
- As a user, I want to set reminders for events so that I can keep track of my daily tasks.
- As a user, I want to select journal prompts so that I never run out of entry ideas.


### Bianca
- As a user, I want a lock button to quickly hide sensitive information so that I feel confident my diary is private.
- As a user, I want a return button in the top left corner so I can return to the previous page. 
- As a user, I want to be able to look at previous diary entries so that I can reflect upon my life.
- As a user, I want to be able to reset my password if I forget it.
- As a user, I want to be able to ensure my privacy is sealed through email verification.


