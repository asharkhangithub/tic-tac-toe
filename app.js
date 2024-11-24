let boxes = document.querySelectorAll(".box");
let rBtn = document.querySelector("#btn");
let Nbtn = document.querySelector("#new-btn");
let playerx = true;

const winnerModal = document.getElementById("winnerModal");
const winnerName = document.getElementById("winnerName");
const closeBtn = document.querySelector(".close");
const winningLine = document.getElementById("winning-line");

const scoreboardModal = document.getElementById("scoreboardModal");
const closeScoreboardModal = document.getElementById("closeScoreboardModal");
const closeScoreboardBtn = document.getElementById("closeScoreboardBtn");
const playerXScore = document.getElementById("playerXScore");
const playerOScore = document.getElementById("playerOScore");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const gameModeScreen = document.getElementById("gameModeScreen");
const playerVsPlayerBtn = document.getElementById("playerVsPlayerBtn");
const playerVsComputerBtn = document.getElementById("playerVsComputerBtn");



const winnigPat = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 8, 5],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];


let isComputerMode = false; // Flag to check if playing against the computer

// Handle Game Mode Selection
playerVsPlayerBtn.addEventListener("click", () => {
    isComputerMode = false;
    gameModeScreen.classList.remove("show");
});

playerVsComputerBtn.addEventListener("click", () => {
    isComputerMode = true;
    gameModeScreen.classList.remove("show");
});

// Computer's Turn Logic
const computerMove = () => {
    const availableBoxes = Array.from(boxes).filter((box) => !box.querySelector("span"));

    if (availableBoxes.length === 0) return; // No moves left

    // Select a random box for simplicity
    const randomIndex = Math.floor(Math.random() * availableBoxes.length);
    const chosenBox = availableBoxes[randomIndex];

    // Simulate a click on the chosen box
    const span = document.createElement("span");
    span.textContent = "O";
    span.style.fontSize = "inherit";
    span.style.color = "red";

    chosenBox.appendChild(span);
    chosenBox.disabled = true;

    playerx = true; // Switch back to the player
    checkWinner();
    updateCurrentPlayerDisplay();
};

// Handle Box Clicks
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (!box.querySelector("span")) {
            const span = document.createElement("span");
            span.textContent = playerx ? "X" : "O";
            span.style.fontSize = "inherit";
            span.style.color = playerx ? "blue" : "red";

            box.appendChild(span);

            playerx = !playerx; // Toggle turn
            box.disabled = true;
            checkWinner();

            // If in computer mode, let the computer play
            if (isComputerMode && !playerx) {
                setTimeout(computerMove, 500); // Add a slight delay for the computer's move
            }

            updateCurrentPlayerDisplay();
        }
    });
});
const buzzer = new Audio("buzzer/mixkit-wrong-answer-bass-buzzer-948.wav");

// Initialize scores
let playerXWins = 0;
let playerOWins = 0;

let isDarkMode = false;

// Toggle theme function
const toggleTheme = () => {
    isDarkMode = !isDarkMode;

    if (isDarkMode) {
        document.body.classList.add("dark-mode");
        themeToggleBtn.innerText = "Switch to Light Mode";
    } else {
        document.body.classList.remove("dark-mode");
        themeToggleBtn.innerText = "Switch to Dark Mode";
    }
};

// Add event listener for theme toggle
themeToggleBtn.addEventListener("click", toggleTheme);

// Reset game
const resetGame = () => {
    playerx = true;
    enableBoxes();
    winnerModal.classList.remove("show");
    document.body.style.backgroundColor = "";
    winningLine.style.display = "none";
};

// Enable boxes for a new game
const enableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = false;
        box.innerHTML = ""; // Clear all boxes
    });
};

// Disable boxes after the game ends
const disableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = true;
    });
};

// Draw the winning line
const drawLine = (startIndex, endIndex) => {
    const startBox = boxes[startIndex].getBoundingClientRect();
    const endBox = boxes[endIndex].getBoundingClientRect();

    const x1 = startBox.left + startBox.width / 2;
    const y1 = startBox.top + startBox.height / 2;
    const x2 = endBox.left + endBox.width / 2;
    const y2 = endBox.top + endBox.height / 2;

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    winningLine.style.width = `${length}px`;
    winningLine.style.transform = `rotate(${angle}deg)`;
    winningLine.style.left = `${x1}px`;
    winningLine.style.top = `${y1}px`;
    winningLine.style.display = "block";
};

// Play the buzzer sound
const playBuzzer = () => {
    buzzer.play();
};

// Change background color on win
const changeBackground = () => {
    document.body.style.backgroundColor = "green";
};

// Display the winner modal and update the scoreboard
const displayWinner = (winner) => {
    const winnerNameText = winner === "X" ? "Player X" : "Player O";

    if (winner === "X") {
        playerXWins++;
    } else if (winner === "O") {
        playerOWins++;
    }

    winnerName.innerText = `${winnerNameText} (${winner}) wins!`;
    winnerModal.classList.add("show");
    disableBoxes();
    playBuzzer();
    changeBackground();

    // Update and display the scoreboard after a short delay
    setTimeout(displayScoreboard, 1000);
};

// Display the scoreboard modal
const displayScoreboard = () => {
    playerXScore.innerText = playerXWins;
    playerOScore.innerText = playerOWins;
    scoreboardModal.style.display = "block";
};

// Close the scoreboard modal
const closeScoreboard = () => {
    scoreboardModal.style.display = "none";
};

closeScoreboardModal.addEventListener("click", closeScoreboard);
closeScoreboardBtn.addEventListener("click", closeScoreboard);

// Check for a winner after each turn
const checkWinner = () => {
    for (let pattern of winnigPat) {
        const [a, b, c] = pattern;

        if (
            boxes[a].innerText &&
            boxes[a].innerText === boxes[b].innerText &&
            boxes[b].innerText === boxes[c].innerText
        ) {
            drawLine(a, c);
            displayWinner(boxes[a].innerText);
            return;
        }
    }
};

// Handle box clicks
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (!box.innerText) {
            box.innerText = playerx ? "X" : "O";
            box.classList.add("clicked");

            setTimeout(() => {
                box.classList.remove("clicked");
            }, 200);

            playerx = !playerx; // Toggle the turn
            box.disabled = true;
            checkWinner();
        }
    });
});

// Event listeners for reset buttons
Nbtn.addEventListener("click", resetGame);
rBtn.addEventListener("click", resetGame);

// Event listener for closing the winner modal
closeBtn.addEventListener("click", () => {
    winnerModal.classList.remove("show");
});

window.addEventListener("click", (event) => {
    if (event.target === winnerModal) {
        winnerModal.classList.remove("show");
    }
});
