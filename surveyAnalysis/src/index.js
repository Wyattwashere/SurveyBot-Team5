const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const tags = require('./tags');
const surveys = require('./surveys');
const comments = require('./comments');
const stopwords = require('./stopwords');
const importSurvey = require('./import');
const exportSurvey = require('./export');

// TODO: need to update, right now just uses Darius's info to connect to database
const connection = mysql.createConnection({
  host     : '137.112.104.147',
  port     : 3306,
  user     : 'daugvidi',
  password : 'password1234',
  database : 'db1',
  multipleStatements : true
});

connection.connect();

const port = process.env.PORT || 8080;

const app = express()
  .use(cors())
  .use(bodyParser.json({limit: '5000mb'}))
  .use(bodyParser.urlencoded({limit: '5000mb', extended: true}))
  .use(tags(connection))
  .use(surveys(connection))
  .use(comments(connection))
  .use(stopwords(connection))
  .use(importSurvey(connection))
  .use(exportSurvey(connection));

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
