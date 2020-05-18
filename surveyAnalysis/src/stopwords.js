const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  router.post('/stopword/survey/:survey_id/insert', (req, res, next) => {
    db.query(
      'INSERT INTO stopword (survey_id, name) VALUES (?, ?)',
      [req.params.survey_id, req.body.name],
      (error) => {
        if (error) {
          console.error(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json({status: 'ok'});
        }
      }
    );
  });

  router.get('/stopword/survey/:survey_id', function (req, res, next) {
    db.query(
      'SELECT name FROM stopword WHERE survey_id = ?',
      [req.params.survey_id],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  });

  return router;
}

module.exports = createRouter;
