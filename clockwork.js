// Layout variables

var height = 6; // Length of how many attempts
var width = 5; // Length of each attempt

// Location of player's current guess
var row = 0; // x axis
var column = 0; // y axis

// Game function variables
var gameOver = false;

// var word = "";
import { eligibleWords, eligibleGuesses } from "./clockworkWordBank.js";
var word = eligibleWords[Math.floor(Math.random() * eligibleWords.length)].toUpperCase();

var totalWins = 0;

// Countdown variables
const countdownEl = document.getElementById("countdown");

const startingMinutes = 3;
let gameTime = startingMinutes * 60;

setInterval(countdown, 1000); // Every second the countdown function is run
function countdown() {
    const minutes = Math.floor(gameTime / 60);

    let seconds = gameTime % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    gameTime--;
    gameTime = gameTime < 0 ? 0 : gameTime; // Prevents negative time

    countdownEl.innerHTML = `${minutes}:${seconds}`
    if (countdownEl.innerHTML == "0:00") {
        gameOver = true;
        alert("Time's up! You have won " + totalWins + " games.")
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
    alert(word)
    for (let x = 0; x < height; x++) {
        for (let y = 0; y < width; y++) {
            /* instead of needing to manually create all the tile elements,
            we use the following to create them.
            If you wanted to manually define them in HTML, it would look like
            <span id="xcoord-ycoord" class="tile">Letter here<span>
            x 30 as there are 30 individual tiles
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
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
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
    else if (e.code == "Backspace") {
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
        document.getElementById("answer").innerText = word;
    }
}

// Validates the user input to ensure only actual words are entered.
function update() {
    let guess = ""
    document.getElementById("answer").innerText = "";

    // Validates the user input to ensure only actual words are entered.

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

    // first run through to eliminate duplicated coutning
    for (let currentColumn = 0; currentColumn < width; currentColumn++) {
        let currentTile = document.getElementById(row.toString() + "-" + currentColumn.toString());
        let letter = currentTile.innerText;
        
        // Is the current letter in the correct position?
        if (word[currentColumn] == letter) {
            currentTile.classList.add("correctLetter");

            // New keyboard logic
            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.remove("presentInWord");
            keyTile.classList.add("correctLetter");

            correct += 1;
            letterCount[letter] -= 1;
        }

        // Win detection
        if (correct == width) {
            gameOver = true;
            totalWins += 1;
        }
    }

    for (let currentColumn = 0; currentColumn < width; currentColumn++) {
        let currentTile = document.getElementById(row.toString() + "-" + currentColumn.toString());
        let letter = currentTile.innerText;
        
        // check if the letter that isn't in the right place, exists at all
        if (!currentTile.classList.contains("correctLetter")) {
            // Is letter in the word?
            if (word.includes(letter) && letterCount[letter] > 0) {
                currentTile.classList.add("presentInWord");

                // New keyboard logic
                let keyTile = document.getElementById("Key" + letter);
                if (!keyTile.classList.contains("correctLetter")) {
                    keyTile.classList.add("presentInWord");
                }

                letterCount[letter] -= 1;
            } // If not in word, add attribute absentFromWord
            else {
                currentTile.classList.add("absentFromWord");
                let keyTile = document.getElementById("Key" + letter);
                keyTile.classList.add("absentFromWord")
            }
        }
    }
    
    row += 1 // Start a new row
    column = 0 // Reset position to original column
    
}

// function newGame() {
//     totalWins += 1
//     gameOver = false
    
//     for (let x = 0; x < height; x++) {
//         for (let y = 0; y < width; y++) {
//             let tile = document.getElementById(x.toString() + "-" + y.toString());
//             tile.innerText = ""; // The letter displayed    
//             document.getElementById("board").removeChild(tile);
//         }
//     }

//     initialise();
//     alert(totalWins);
// }