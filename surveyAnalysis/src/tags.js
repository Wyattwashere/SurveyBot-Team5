const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  router.post('/tag', (req, res, next) => {
    db.query(
      'BEGIN; INSERT INTO tag (name) VALUES (?); COMMIT;',
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

  router.post('/tag/survey/:survey_id/insert', (req, res, next) => {
    db.query(
      "BEGIN; INSERT INTO `tag` (`name`) VALUES (?); INSERT INTO `survey_to_tag` (`survey_id`,`tag_id`) VALUES (?,LAST_INSERT_ID()); COMMIT;",
      [req.body.tag_name, req.params.survey_id],
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

  router.post('/tag/comment/:comment_id/insert', (req, res, next) => {
    db.query(
      "INSERT INTO `comment_to_tag` (`comment_id`,`tag_id`) VALUES (?,?)",
      [req.params.comment_id, req.body.tag_id, ],
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

  router.get('/tag', function (req, res, next) {
    db.query(
      'SELECT id, name FROM tag',
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

  router.get('/tag/survey/:survey_id', function (req, res, next) {
    db.query(
      'SELECT tag_id, name AS tag_name FROM' +
        '(SELECT tag_id FROM survey_to_tag WHERE survey_to_tag.survey_id = ?) AS x INNER JOIN tag WHERE tag_id=id',
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

  router.get('/tag/comment/:comment_id', function (req, res, next) {
    db.query(
      'SELECT tag_id, name AS tag_name FROM' +
        '(SELECT tag_id FROM comment_to_tag WHERE comment_to_tag.comment_id = ?) AS x INNER JOIN tag WHERE tag_id=id',
      [req.params.comment_id],
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

  router.put('/tag/:id', function (req, res, next) {
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

  router.delete('/tag/:id', function (req, res, next) {
    db.query(
      'DELETE FROM tag WHERE id=?',
      [req.params.id],
      (error) => {
        if (error) {
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json({status: 'ok'});
        }
      }
    );
  });

  router.delete('/tag/comment/delete', function (req, res, next) {
    db.query(
      'DELETE FROM comment_to_tag WHERE tag_id=? AND comment_id=?',
      [req.body.tag_id, req.body.comment_id],
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
