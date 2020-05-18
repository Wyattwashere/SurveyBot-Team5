const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  router.post('/survey', (req, res, next) => {
    db.query(
      'INSERT INTO survey (name) VALUES (?)',
      [req.body.name],
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

  router.get('/survey', function (req, res, next) {
    db.query(
      'SELECT id, name FROM survey',
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

  router.put('/survey/:id', function (req, res, next) {
    db.query(
      'UPDATE survey SET name=? WHERE id=?',
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

  router.delete('/survey', function (req, res, next) {
    db.query(
      'DELETE FROM survey WHERE id=?',
      [req.body.id],
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
