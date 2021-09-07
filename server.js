const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const MyDb = require('./src/db');
const upload = multer();
require('dotenv').config();
const routes = require('./src/routes');

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

MyDb.init('test.db');

const API_PREFIX = 'api';

app.use(`/${API_PREFIX}`, routes);