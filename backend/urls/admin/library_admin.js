'use strict';

const router = require('express').Router(),
  db = require('../../models/pg_db'),
  auth = require('./lib_auth');

module.exports = router;

router.route('/')
.get(auth.need, (req, res) => {
  res.render('./admin/library.html', {
    title: 'Библиотека'
  });
});

router.route('/search')
.post(auth.need, (req, res) => {
  let query = `
      SELECT
        id,
        title,
        short_descr
      FROM library_articles
      WHERE id::text LIKE $1
        OR title LIKE $2
      ORDER BY title ASC, id ASC;`,
    queryPars = [`${req.body.s}%`, `%${req.body.s}%`];
  db.execute(query, queryPars)
  .then(r => {
    res.json({
      data: r.rows
    });
  })
  .catch(e => {
    console.error(e);
  });
});

router.route('/article_edit')
.get(auth.need, (req, res) => {
  let query = 'SELECT * FROM library_articles WHERE id=$1;',
    queryPars = [req.query.id];
  db.execute(query, queryPars)
  .then(r => {
    let a = r.rows[0];
    res.render('./admin/article_edit.html', {
      a: a,
      title: 'Редактирование статьи',
    });
  })
  .catch(e => {
    console.error(e);
  });
});
