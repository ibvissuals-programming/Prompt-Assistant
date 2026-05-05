const USERS_KEY = "ib_users";
const CURRENT_USER_KEY = "ib_current_user";

const normalize = (str) => str.trim().toLowerCase();

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signup(username, password) {
  const users = getUsers();

  const cleanUsername = normalize(username);
  const cleanPassword = password.trim();

  const exists = users.find(u => u.username === cleanUsername);

  if (exists) return { error: "User already exists" };

  users.push({
    username: cleanUsername,
    password: cleanPassword
  });

  saveUsers(users);
  return { success: true };
}

export function login(username, password) {
  const users = getUsers();

  const cleanUsername = normalize(username);
  const cleanPassword = password.trim();

  const user = users.find(
    u => u.username === cleanUsername && u.password === cleanPassword
  );

  if (!user) return { error: "Invalid username or password" };

  localStorage.setItem(CURRENT_USER_KEY, cleanUsername);
  return { success: true };
}

export function getCurrentUser() {
  const username = localStorage.getItem(CURRENT_USER_KEY);
  return username ? { username } : null;
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}
