const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  router.get('/comment', function (req, res, next) {
    db.query(
      'SELECT survey_id,comment_id,question,response FROM comment',
      [],
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

  router.put('/comment/:survey_id/:comment_id:', function (req, res, next) {
    db.query(
      'UPDATE tag SET name=? WHERE id=?',
      [req.body.name, req.params.id],
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
