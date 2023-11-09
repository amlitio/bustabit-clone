// main.js

// Initialize the user database in localStorage if it doesn't exist
function initializeUsersDB() {
  if (!getLocalStorage('users')) {
    setLocalStorage('users', JSON.stringify({}));
  }
  if (!getLocalStorage('balance')) {
    setLocalStorage('balance', '1000'); // Starting balance for the sake of example
  }
}

// User registration function
function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const users = JSON.parse(getLocalStorage('users'));
  if (users[username]) {
    alert('User already exists!');
    return;
  }
  users[username] = { password, balance: 1000 }; // Assign a default balance
  setLocalStorage('users', JSON.stringify(users));
  alert('Registration successful!');
}

// User login function
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const users = JSON.parse(getLocalStorage('users'));
  const userData = users[username];
  if (userData && userData.password === password) {
    setLocalStorage('session', username);
    window.location.href = 'game.html'; // Redirect to game page
  } else {
    alert('Invalid username or password!');
  }
}

// User logout function
function logout() {
  localStorage.removeItem('session');
  window.location.href = 'index.html'; // Redirect to home page
}

// Utility functions for localStorage access
function getLocalStorage(key) {
  return localStorage.getItem(key);
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

// Game logic
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let gameRunning = false;
let gameMultiplier = 1.0;
let animationFrameId;
let userBet = 0;

function startGame() {
  gameRunning = true;
  gameMultiplier = 1.0;
  userBet = parseFloat(document.getElementById('bet-amount').value) || 0;
  const currentBalance = parseFloat(getLocalStorage('balance'));
  if (userBet <= 0 || userBet > currentBalance) {
    alert('Invalid bet amount!');
    gameRunning = false;
    return;
  }
  setLocalStorage('balance', (currentBalance - userBet).toString());
  updateBalanceDisplay();
  window.requestAnimationFrame(updateGame);
}

function updateGame() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gameMultiplier += 0.01;
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(50, canvas.height - 50, 100, -gameMultiplier * 10);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`Multiplier: ${gameMultiplier.toFixed(2)}x`, 50, canvas.height - 60);
  animationFrameId = window.requestAnimationFrame(updateGame);
}

document.getElementById('place-bet').addEventListener('click', startGame);

document.getElementById('stop-button').addEventListener('click', function() {
  if (gameRunning) {
    gameRunning = false;
    const payout = userBet * gameMultiplier;
    const newBalance = parseFloat(getLocalStorage('balance')) + payout;
    setLocalStorage('balance', newBalance.toString());
    updateBalanceDisplay();
    console.log(`Bet stopped at multiplier: ${gameMultiplier.toFixed(2)}x, payout: ${payout}`);
    window.cancelAnimationFrame(animationFrameId);
  }
});

function updateBalanceDisplay() {
  const balanceElement = document.getElementById('balance');
  if (balanceElement) {
    balanceElement.textContent = getLocalStorage('balance');
  }
}

// Call this function when the game page loads to display the user's balance
updateBalanceDisplay();

// Initialize the user database when the script loads
initializeUsersDB();
