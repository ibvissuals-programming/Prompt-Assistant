import { storage } from '../utils/storage';

export const getUsers = () => storage.get('ib_users') || [];
export const saveUsers = (users) => storage.set('ib_users', users);

export const signup = (username, password) => {
  const users = getUsers();
  if (users.find(u => u.username === username)) {
    return { success: false, error: 'Username already exists' };
  }
  const newUser = { username, password: btoa(password) };
  saveUsers([...users, newUser]);
  return { success: true };
};

export const login = (username, password) => {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === btoa(password));
  if (user) {
    storage.set('ib_session', { username: user.username, loginAt: Date.now() });
    return { success: true };
  }
  return { success: false, error: 'Invalid credentials' };
};

export const logout = () => {
  storage.remove('ib_session');
};

export const getCurrentUser = () => {
  return storage.get('ib_session');
};

export const isAuthenticated = () => {
  return !!getCurrentUser();
};
