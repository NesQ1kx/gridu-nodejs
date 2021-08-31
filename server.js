const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const MyDb = require('./database');
const upload = multer();
require('dotenv').config();
const { HttpNotFoundException, HttpForbiddenException, HttpException } = require('./error-handling');
const { isDateValid } = require('./utils');

app.use(cors());
app.use(express.json());
app.use(upload.none());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

const db = new MyDb('test.db');

const API_PREFIX = 'api';

app.post(`/${API_PREFIX}/users`, async (req, res) => {
  const user = req.body;
  const { lastID } = await db.run('INSERT INTO USERS (username) VALUES (?)', user.username);
  const createdUser = await db.get('SELECT * FROM USERS WHERE _id = ?', lastID);
  res.json(createdUser);
});

app.get(`/${API_PREFIX}/users`, async (req, res) => {
  const users = await db.all('SELECT * FROM Users');
  res.json(users);
});

app.post(`/${API_PREFIX}/users/:_id/exercises`, async (req, res) => {
  try {
    const userId = req.params._id;
    const user = await db.get('SELECT * FROM Users WHERE _id = ?', userId);
    
    if (!user) {
      throw new HttpNotFoundException('User does not exist');
    }
    
    const exercise = req.body;
    if (exercise.date) {
      if (!isDateValid(exercise.date)) {
        throw new HttpForbiddenException('Date format is not valid');
      }
      const newDate = +new Date(exercise.date);
      await db.run('INSERT INTO Exercises (description, duration, userId, date) VALUES (?, ?, ?, ?)', exercise.description, exercise.duration, userId, newDate);
    } else {
      await db.run('INSERT INTO Exercises (description, duration, userId) VALUES (?, ?, ?)', exercise.description, exercise.duration, userId);
    }
  
    user.exercises = await db.all('SELECT * FROM Exercises WHERE userId = ?', userId);
    res.json(user);
  } catch(e) {
    res.status(e.code).json(e);
  }
});

app.get(`/${API_PREFIX}/users/:_id/logs`, async (req, res) => {
  try {
    const userId = req.params._id;
    const user = await db.get('SELECT * FROM Users WHERE _id = ?', userId);

    if (!user) {
      throw new HttpNotFoundException('User does not exist');
    }

    const from = req.query.from;
    const to = req.query.to;

    if ((from && !isDateValid(from)) || (to && !isDateValid(to))) {
      throw new HttpForbiddenException('Date format is not valid');
    }

    const limit = req.query.limit;
    let exercises = [];

    if (from && to) {
      const parsedFrom = +new Date(from);
      const parsedTo = +new Date(to);
      exercises = await db.all(`SELECT duration, description, date
                                FROM Exercises
                                WHERE userId = ? AND date > ? AND date < ?
                                ${limit ? 'LIMIT ?' : ''}`, userId, parsedFrom, parsedTo, limit);
    }

    if (from && !to) {
      const parsedFrom = +new Date(from);
      exercises = await db.all(`SELECT duration, description, date
                                FROM Exercises
                                WHERE userId = ? AND date > ?
                                ${limit ? 'LIMIT ?' : ''}`, userId, parsedFrom, limit);
    }

    if (!from && to) {
      const parsedTo = +new DataCue(to);
      exercises = await db.all(`SELECT duration, description, date
                                FROM Exercises
                                WHERE userId = ? AND date < ?
                                ${limit ? 'LIMIT ?' : ''}`, userId, parsedTo, limit);
    }

    if (!from && !to) {
      exercises = await db.all(`SELECT duration, description, date
                                FROM Exercises
                                WHERE userId = ?
                                ${limit ? 'LIMIT ?' : ''}`, userId, limit);
    }

    user.exercises = exercises;
    user.count = exercises.length;

    res.json(user);
  } catch(e) {
    res.status(e.code).json(e);
  }
});
