const express = require('express');
const fastcsv = require('fast-csv');
const papa = require('papaparse');
const fs = require('fs');
const ws = fs.createWriteStream('survey_export.csv');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  router.get('/export', function(req, res) { // REST Endpoint to upload the data from CSV file to database.
    var values = [];

    column_names = ['instructor_firstname',
    'instructor_lastname',
    'project',
    'course_code',
    'course_title',
    'course_uniqueid',
    'question',
    'question_type',
    'enrollments',
    'respondents',
    'response_rate',
    'mean',
    'std',
    'value',
    'option_respondents',
    'option_response_rate',
    'comments',
    'GROUP_CONCAT(tags) as tags'];

    db.query('SELECT ' + column_names +  ' FROM course_eval_view GROUP BY comments',
      [req.body], function(err, data, fields) {
       if (!err) {
        const jsonData = JSON.parse(JSON.stringify(data));
        res.status(200).json(jsonData);
        } else {
          console.log('\nError while performing Query: ', err);
          res.sendStatus(500);
        }
    });
  });

  return router;
}

module.exports = createRouter;
