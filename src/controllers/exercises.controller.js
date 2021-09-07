const { getUserById } = require('../services/users.service');
const { HttpNotFoundException, HttpBadRequestException } = require('../../error-handling');
const { createExercise, getExerciseByUserId } = require('../services/exercises.service');

const postExercises = async (req, res) => {
  try {
    const userId = req.params._id;
    const user = await getUserById(userId);
    if (!user) {
      throw new HttpNotFoundException('User does not exist');
    }

    const exercise = req.body;

    if (!exercise.description || !exercise.duration) {
      throw new HttpBadRequestException('Fields required');
    }
    await createExercise(userId, exercise);
    user.exercises = await getExerciseByUserId(userId);
    res.json(user);
  } catch(e) {
    res.status(e.code).json(e);
  }
}

module.exports = {
  postExercises,
}