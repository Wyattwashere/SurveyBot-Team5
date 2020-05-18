const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  // import data from course evaluation csv to course_eval_pre table
  router.post('/import', function(req, res) {
    var values = [];
    var body = req.body.slice(1);

    column_names = ['instructor_firstname',
    'instructor_lastname',
    'project',
    'course_code',
    'course_title',
    'course_uniqueid',
    'question_key',
    'enrollments',
    'respondents',
    'response_rate',
    'mean',
    'std',
    'value',
    'option_respondents',
    'option_response_rate',
    'comments',
    'survey_id'];

    db.query('INSERT INTO course_eval_pre (' + column_names +  ') VALUES ?',
      [body], function(err, rows, fields) {

       if (!err) {
        console.log('\nSuccessfully updated database: ', rows);
        res.sendStatus(200);
        } else {
          console.log('\nError while performing Query: ', err);
          res.sendStatus(500);
        }
    });
  });

  // import questions for a survey into question table
  router.post('/import/questions', function(req, res) {
    var values = [];
    var body = req.body.slice(1);

    column_names = ['question_key',
    'question_type',
    'question',
    'survey_id'];

    db.query('INSERT INTO question (' + column_names +  ') VALUES ?',
      [body], function(err, rows, fields) {

       if (!err) {
        console.log('\nSuccessfully updated database: ', rows);
        res.sendStatus(200);
        } else {
          console.log('\nError while performing Query: ', err);
          res.sendStatus(500);
        }
    });
  });

  // insert comments from course_eval_pre into comment table
  // then update course_eval_pre to contain comment IDs
  router.post('/import/upload', function (req, res, next) {
    db.query(
      `BEGIN;

      INSERT INTO comment (survey_id,question,response) SELECT survey_id, question, comments AS response FROM course_eval_view WHERE question_type="Write-In";

      UPDATE course_eval_pre
      INNER JOIN comment ON (course_eval_pre.comments = comment.response AND course_eval_pre.survey_id = comment.survey_id)
      SET course_eval_pre.comment_id = comment.comment_id;

      COMMIT;`,
      [],
      (error) => {
        if (error) {
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json({status: 'ok'});
        }
      }
    );
  });

  return router;
}

module.exports = createRouter;
