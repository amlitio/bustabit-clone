// main.js

// Mock user database in localStorage
function initializeUsersDB() {
  if (!getLocalStorage('users')) {
    setLocalStorage('users', JSON.stringify({}));
  }
}

function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const users = JSON.parse(getLocalStorage('users'));
  if (users[username]) {
    alert('User already exists!');
    return;
  }
  users[username] = { password };
  setLocalStorage('users', JSON.stringify(users));
  alert('Registration successful!');
}

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

function logout() {
  localStorage.removeItem('session');
  window.location.href = 'index.html'; // Redirect to home page
}

function getLocalStorage(key) {
  return localStorage.getItem(key);
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

initializeUsersDB();
