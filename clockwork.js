// Game board layout variables
var height = 6; // Length of how many attempts
var width = 5; // Length of each attempt

// Location of player's current guess
var row = 0; // x axis
var column = 0; // y axis

// Game function variables
var gameOver = false;

// Defining the eligible guesses and words for a game
import { eligibleWords, eligibleGuesses } from "./clockworkWordBank.js";
var word = eligibleWords[Math.floor(Math.random() * eligibleWords.length)].toUpperCase();

// Countdown variables
const countdownEl = document.getElementById("countdown");

// Total game time
const startingMinutes = 3;
let gameTime = startingMinutes * 60;

// Every second the countdown function is run
setInterval(countdown, 1000);

// Handles the updating of the countdown clock
function countdown() {
    const minutes = Math.floor(gameTime / 60);

    let seconds = gameTime % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    gameTime--;
    gameTime = gameTime < 0 ? 0 : gameTime; // Prevents negative time

    
    // Replace the timer with the word if the game is complete
    if (gameOver == true) {
        countdownEl.innerHTML = "The word is " + word
    }
    else {
        countdownEl.innerHTML = `${minutes}:${seconds}`
    }
    
    // If the timer ends, the game is finished
    if (countdownEl.innerHTML == "0:00") {
        alert("Time's up! You have failed, the word was " + word);
        gameOver = true;
    }
}

// On page load, initialise the game
window.onload = function() {
    initialise();
    countdown();
}

// Actual game logic
function initialise() {
    // Create game
    // x = Current attempt, y = Location of letter within word
    
    for (let x = 0; x < height; x++) {
        for (let y = 0; y < width; y++) {
            /* instead of needing to manually create all the tile elements,
            we use the following to create them.
            If you wanted to manually define them in HTML, it would look like
            <span id="xcoord-ycoord" class="tile">Letter here<span>
            x30 as there are 30 individual tiles (6*5)
            */
            let tile = document.createElement("span");
            tile.id = x.toString() + "-" + y.toString();
            tile.classList.add("tile");
            tile.innerText = ""; // The letter displayed
            document.getElementById("board").appendChild(tile);
        }
    }

    // Create the key board
    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]
    ]

    for (let i = 0; i < keyboard.length; i++) {
        let currRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currRow.length; j++) {
            let keyTile = document.createElement("div");

            let key = currRow[j];
            keyTile.innerText = key;
            if (key == "Enter") {
                keyTile.id = "Enter";
            }
            else if (key == "⌫") {
                keyTile.id = "Backspace";
            }
            else if ("A" <= key && key <= "Z") {
                keyTile.id = "Key" + key; // "Key" + "A";
            } 
 
            keyTile.addEventListener("click", processKey);

            if (key == "Enter") {
                keyTile.classList.add("enter-key-tile");
            } else {
                keyTile.classList.add("key-tile");
            }
            // Adds key to keyboard row
            keyboardRow.appendChild(keyTile);
        }
        // Adds keyboard row to the main website body
        document.body.appendChild(keyboardRow);
    }
    

    // Listen for Key Press
    document.addEventListener("keyup", (e) => {
        processInput(e);
    })
}

function processKey() {
    let e = { "code" : this.id };
    processInput(e);
}

function processInput(e) {
    if (gameOver == true) return; 
    // The next line of code returns the key that was pressed by the user
    // alert(e.code)

    if ("KeyA" <= e.code && e.code <= "KeyZ") {
        if (column < width) {
            let currentTile = document.getElementById(row.toString() + "-" + column.toString());
            if (currentTile.innerText == "") {
                currentTile.innerText = e.code[3]; // Accesses the 4th character in string KeyA etc.
                column += 1;
            }
        }
    }
    else if (e.code == "Backspace" || e.code == "Delete") {
        // Ensures characters can only be deleted if there is at least one character entered
        if (0 < column && column <= width) {
            column -= 1;
        }
        let currentTile = document.getElementById(row.toString() + "-" + column.toString());
        currentTile.innerText = "";
    }
    else if (e.code == "Enter") {
        update();
    }

    // If all attempts have been used up
    if (gameOver == false && row == height) {
        gameOver = true;
    }
}

// Validates the user input to ensure only actual words are entered.
function update() {
    let guess = ""
    document.getElementById("answer").innerText = "";

    //string up the guesses into the word
    for (let currentColumn = 0; currentColumn < width; currentColumn++) {
        let currentTile = document.getElementById(row.toString() + "-" + currentColumn.toString());
        let letter = currentTile.innerText;
        guess += letter; // Stores the user's current guess by concatenating all letters.
    }

    // If the guess is in the list of eligible guesses, allow the guess.
    if (eligibleWords.includes(guess.toLowerCase()) || eligibleGuesses.includes(guess.toLowerCase())) {
    }
    else {
        alert("Please enter a valid word, your guess " + guess + " is not valid.");
        return;
    }

    // count the number of unique letters in the generated word
    let correct = 0;
    let letterCount = {}; // A dictionary containing the letter and the count as the value

    for (let count = 0; count < word.length; count++) {
        var letter = word[count];
        if (letterCount[letter]) { // If there exists a key with the letter A, B, C etc, then increment.
            letterCount[letter] += 1;
        }
        else {
            letterCount[letter] = 1
        }
    }

    // first run through to eliminate duplicated counting
    for (let currentColumn = 0; currentColumn < width; currentColumn++) {
        // The gameboard tile
        let currentTile = document.getElementById(row.toString() + "-" + currentColumn.toString());
        let letter = currentTile.innerText;
        
        // Is the current letter in the correct position?
        if (word[currentColumn] == letter) {
            currentTile.classList.add("correctLetter");

            // New keyboard logic
            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.remove("absentFromWord", "presentInWord");
            keyTile.classList.add("correctLetter");

            correct += 1;
            letterCount[letter] -= 1;
        }

        // Win detection
        if (correct == width) {
            gameOver = true;
        }
    }

    for (let currentColumn = 0; currentColumn < width; currentColumn++) {
        let currentTile = document.getElementById(row.toString() + "-" + currentColumn.toString());
        let letter = currentTile.innerText;
        
        // The following runs only if the letter hasn't been marked as correct to avoid overriding
        if (!currentTile.classList.contains("correctLetter")) {
            // Is letter in the word?
            if (word.includes(letter) && letterCount[letter] > 0) {
                currentTile.classList.add("presentInWord");

                // Update keyboard to make present letters yellow
                let keyTile = document.getElementById("Key" + letter);
                if (!keyTile.classList.contains("correctLetter")) {
                    keyTile.classList.remove("absentFromWord");
                    keyTile.classList.add("presentInWord");
                }

                letterCount[letter] -= 1;
            } // If not in word, add attribute absentFromWord
            else {
                currentTile.classList.add("absentFromWord");

                // Ensure the keyboard is only updated when the letter isn't in the word at all
                let keyTile = document.getElementById("Key" + letter);
                if (!keyTile.classList.contains("correctLetter") && !keyTile.classList.contains("presentInWord")) {
                    keyTile.classList.add("absentFromWord");
                }
            }
        }
    }
    
    row += 1 // Start a new row
    column = 0 // Reset position to original column
    
}