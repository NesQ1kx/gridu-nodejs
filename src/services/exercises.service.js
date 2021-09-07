const { HttpBadRequestException } = require('../../error-handling');
const MyDb = require('../db/index');
const { isDateValid } = require('../utils');

const createExercise = async (userId, exercise) => {
  try {
    if (Number.isNaN(Number(exercise.duration))) {
      throw new HttpBadRequestException('Duration must be integer');
    }
    
    if (exercise.date) {
      if (!isDateValid(exercise.date)) {
        throw new HttpBadRequestException('Date format is not valid');
      }

      const parsedDate = +new Date(exercise.date);
      await MyDb.run('INSERT INTO Exercises (description, duration, userId, date) VALUES (?, ?, ?, ?)', exercise.description, exercise.duration, userId, parsedDate);
    } else {
      await MyDb.run('INSERT INTO Exercises (description, duration, userId) VALUES (?, ?, ?)', exercise.description, exercise.duration, userId);
    }
  } catch(e) {
    throw e;
  }
}

const getExerciseByUserId = async (id) => {
  return await MyDb.all('SELECT * FROM Exercises WHERE userId = ?', id);
}

const getUserExercises = async (userId, from, to, limit) => {
  if (from && to) {
    const parsedFrom = +new Date(from);
    const parsedTo = +new Date(to);
    return await MyDb.all(`SELECT duration, description, date
                              FROM Exercises
                              WHERE userId = ? AND date > ? AND date < ?
                              ${limit ? 'LIMIT ?' : ''}`, userId, parsedFrom, parsedTo, limit);
  }

  if (from && !to) {
    const parsedFrom = +new Date(from);
    return await MyDb.all(`SELECT duration, description, date
                              FROM Exercises
                              WHERE userId = ? AND date > ?
                              ${limit ? 'LIMIT ?' : ''}`, userId, parsedFrom, limit);
  }

  if (!from && to) {
    const parsedTo = +new Date(to);
    return await MyDb.all(`SELECT duration, description, date
                              FROM Exercises
                              WHERE userId = ? AND date < ?
                              ${limit ? 'LIMIT ?' : ''}`, userId, parsedTo, limit);
  }

  if (!from && !to) {
    return await MyDb.all(`SELECT duration, description, date
                              FROM Exercises
                              WHERE userId = ?
                              ${limit ? 'LIMIT ?' : ''}`, userId, limit);
  }
}

module.exports = {
  createExercise,
  getExerciseByUserId,
  getUserExercises
}