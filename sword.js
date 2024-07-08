// Processing of logic

var height = 6; // Length of how many attempts
var width = 5; // Length of each attempt

// Location of player's current guess
var row = 0; // x axis
var column = 0; // y axis

var gameOver = false;
var word = "";
import { eligibleWords } from "./swordBank.js";

// On page load, initialise the game
window.onload = function() {
    word = eligibleWords[Math.floor(Math.random() * eligibleWords.length)];
    initialise();
}

function initialise() {

    // Create game
    // x = Current attempt, y = Location of letter within word
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

    // Listen for key press
    document.addEventListener("keyup", (e) => { //keyup is used to ensure holding the key doesn't use up all attempts
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
            if (validateInput() == true) {
                update();
                row += 1 // Start a new row
                column = 0 // Reset position to original column
            }
        }

        // If all attempts have been used up
        if (gameOver == false && row == height) {
            gameOver = true;
            document.getElementById("answer").innerText = word.toUpperCase();
        }
    })
}

// Validates the user input to ensure only actual words are entered.
function validateInput() {
    let guess = ""

        for (let currentColumn = 0; currentColumn < width; currentColumn++) {
            let currentTile = document.getElementById(row.toString() + "-" + currentColumn.toString());
            let letter = currentTile.innerText.toLowerCase();
            
            // Stores the user's current guess by concatenating all letters.
            guess += letter;
        }

        // If the guess is in the list of eligible words, allow the guess.
        if (eligibleWords.includes(guess)) {
            return true
        }
        else {
            alert("Please enter a valid word, your guess " + guess.toUpperCase() + " is not valid.")
            return false
        }
}

function update() {
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

    for (let currentColumn = 0; currentColumn < width; currentColumn++) {
        let currentTile = document.getElementById(row.toString() + "-" + currentColumn.toString());
        let letter = currentTile.innerText.toLowerCase();
        
        // Is the current letter in the correct position?
        if (word[currentColumn] == letter) {
            currentTile.classList.add("correctLetter");
            correct += 1;
            letterCount[letter] -= 1;
        } // Is letter in the word?
        else if (word.includes(letter) && letterCount[letter] > 0) {
            currentTile.classList.add("presentInWord");
            letterCount[letter] -= 1;
        } // If not in word, add attribute absentFromWord
        else {
            currentTile.classList.add("absentFromWord");
        }

        if (correct == width) {
            gameOver = true;
        }
    }
}