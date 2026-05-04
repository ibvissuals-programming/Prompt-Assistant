const USERS_KEY = 'ib_users';
const SESSION_KEY = 'ib_current_user';

export function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signup(username, password) {
  const users = getUsers();
  if (users.find(u => u.username === username)) {
    return { success: false, error: 'Username already exists' };
  }
  users.push({ username, password });
  saveUsers(users);
  return { success: true };
}

export function login(username, password) {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return { success: false, error: 'Invalid username or password' };
  }
  localStorage.setItem(SESSION_KEY, username);
  return { success: true };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

// Returns {username} object so useAuth + all components work without changes
export function getCurrentUser() {
  const username = localStorage.getItem(SESSION_KEY);
  return username ? { username } : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem(SESSION_KEY);
}
