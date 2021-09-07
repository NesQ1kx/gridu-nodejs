const { addUser, getAllUsers } = require('../services/users.service');
const { HttpBadRequestException } = require('../../error-handling');

const getUsers = async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
}

const postUsers = async (req, res) => {
  try {
    const user = req.body;
    if (!user.username) {
      throw new HttpBadRequestException('Empty body');
    }
    const createdUser = await addUser(user);
    return res.json(createdUser);
  } catch(e) {
    res.status(e.code).json(e);
  }
}

module.exports = {
  getUsers,
  postUsers
}