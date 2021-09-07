const { HttpNotFoundException, HttpBadRequestException } = require('../../error-handling');
const { getUserExercises, getExerciseByUserId } = require('../services/exercises.service');
const { getUserById } = require('../services/users.service');
const { isDateValid } = require('../utils');

const getLogs = async (req, res) => {
  try {
    const userId = req.params._id;
    const user = await getUserById(userId);

    if (!user) {
      throw new HttpNotFoundException('User not found');
    }

    const from = req.query.from;
    const to = req.query.to;
    
    if ((from && !isDateValid(from)) || (to && !isDateValid(to))) {
      throw new HttpBadRequestException('Date format is not valid');
    }

    user.exercises = await getUserExercises(userId, from, to, req.query.limit);
    const userExercises = await getExerciseByUserId(userId);
    user.count = userExercises.length;

    res.json(user);
  } catch(e) {
    res.status(e.code).json(e);
  }
}

module.exports = {
  getLogs,
}