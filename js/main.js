// main.js

// Initialize the user database in localStorage if it doesn't exist
function initializeUsersDB() {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify({}));
  }
  if (!localStorage.getItem('balance')) {
    localStorage.setItem('balance', '1000'); // Starting balance for the sake of example
  }
}

// User registration function
function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const users = JSON.parse(localStorage.getItem('users'));
  if (users[username]) {
    alert('User already exists!');
    return;
  }
  users[username] = { password, balance: 1000 }; // Assign a default balance
  localStorage.setItem('users', JSON.stringify(users));
  alert('Registration successful!');
}

// User login function
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const users = JSON.parse(localStorage.getItem('users'));
  const userData = users[username];
  if (userData && userData.password === password) {
    localStorage.setItem('session', username);
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

// Check if the user is logged in when the game page loads
function checkLogin() {
  if (!localStorage.getItem('session')) {
    window.location.href = 'index.html'; // Redirect to login page if not logged in
  } else {
    updateBalanceDisplay(); // Update balance display if logged in
  }
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
  const currentBalance = parseFloat(localStorage.getItem('balance'));
  if (userBet <= 0 || userBet > currentBalance) {
    alert('Invalid bet amount!');
    gameRunning = false;
    return;
  }
  localStorage.setItem('balance', (currentBalance - userBet).toString());
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
    const newBalance = parseFloat(localStorage.getItem('balance')) + payout;
    localStorage.setItem('balance', newBalance.toString());
    updateBalanceDisplay();
    console.log(`Bet stopped at multiplier: ${gameMultiplier.toFixed(2)}x, payout: ${payout}`);
    window.cancelAnimationFrame(animationFrameId);
  }
});

function updateBalanceDisplay() {
  const balanceElement = document.getElementById('balance');
  if (balanceElement) {
    balanceElement.textContent = localStorage.getItem('balance');
  }
}

// Leaderboard logic
function updateLeaderboard() {
  const users = JSON.parse(localStorage.getItem('users'));
  const leaderboardData = Object.keys(users).map(username => ({
    name: username,
    balance: users[username].balance
  }));

  // Sort users by balance in descending order
  leaderboardData.sort((a, b) => b.balance - a.balance);

  // Update the leaderboard table
  const leaderboardTable = document.getElementById('leaderboard-table-body');
  leaderboardTable.innerHTML = ''; // Clear existing leaderboard entries
  leaderboardData.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${user.name}</td><td>${user.balance}</td>`;
    leaderboardTable.appendChild(row);
  });
}

// Call this function when the game page loads
checkLogin();
updateLeaderboard();

// Initialize the user database when the script loads
initializeUsersDB();

