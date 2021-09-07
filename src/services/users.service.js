const MyDb = require('../db/index');

const addUser = async (user) => {
  const { lastID } = await MyDb.run('INSERT INTO USERS (username) VALUES (?)', user.username);
  const createdUser = await MyDb.get('SELECT * FROM USERS WHERE _id = ?', lastID);
  return createdUser;
}

const getAllUsers = async () => {
  return await MyDb.all('SELECT * FROM Users');
}

const getUserById = async (id) => {
  return await MyDb.get('SELECT * FROM Users WHERE _id = ?', id);
}

module.exports = {
  addUser,
  getAllUsers,
  getUserById
}