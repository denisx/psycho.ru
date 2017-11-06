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
        OR LOWER(title) LIKE LOWER($2)
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
  let query = 'SELECT * FROM library_categories ORDER BY name ASC;',
    queryPars = [],
    categories = [];
  db.execute(query, queryPars)
  .then(c => {
    categories = c.rows;
    query = 'SELECT * FROM library_articles WHERE id=$1;';
    queryPars = [req.query.id];
    return db.execute(query, queryPars);
  })
  .then(r => {
    let a = r.rows[0];
    res.render('./admin/article_edit.html', {
      a: a,
      categories: categories,
      title: 'Редактирование статьи',
    });
  })
  .catch(e => {
    console.error(e);
  });
});

router.route('/article_update')
.post(auth.need, (req, res) => {
  let query = `
      UPDATE library_articles
      SET
        author = $2,
        body = $3,
        category = $4,
        description = $5,
        keywords = $6,
        short_descr = $7,
        title = $8
      WHERE id = $1;`,
    queryPars = [
      req.body.id,
      req.body.author,
      req.body.body,
      req.body.category,
      req.body.description,
      req.body.keywords,
      req.body.short_descr,
      req.body.title];
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

router.route('/article_show')
.get(auth.need, (req, res) => {
  // рендер выбранной статьи
  function renderArticle(a, req, res) {
    let category = '';
    // TODO: переписать нижеследующий код определения категории
    // <span class="item-mark korpkultura"><a href="#">Корпкультура</a></span>
    // вовлеченность
    if(a.category === 1) {
      category = '<span class="item-mark vovlechenost"><a href="/library/involvement">Вовлеченность</a></span>';
    }
    // идеология, она же полезные привычки
    if(a.category === 2) {
      category = '<span class="item-mark poleznye-privuchki"><a href="/library/ideology">Идеология</a></span>';
    }
    // корпоративная культура
    if(a.category === 3) {
      category = '<span class="item-mark korpkultura"><a href="/library/corporate_culture">Корпкультура</a></span>';
    }
    // оценка персонала
    if(a.category === 4) {
      category = '<span class="item-mark instrumenty-ocenki"><a href="/library/assessment">Оценка персонала</a></span>';
    }
    return category;
  }

  function renderPLinks(a) {
    let s = {
      b1: `
        <div class="banner vovlechenost">
          <img src="/media/images/library/library-banner01.svg" alt="">
          <span class="banner-text small-text">##</span>
          <a href="/products/involvement" class="btn">Узнать больше</a>
        </div>`,
      b2: `
        <div class="banner korpkultura">
          <img src="/media/images/library/library-banner02.svg" alt="">
          <span class="banner-text small-text">##</span>
          <a href="/products/corpcult" class="btn">Узнать больше</a>
        </div>`,
      b3: `
        <div class="banner instr-ocenki">
          <img src="/media/images/library/library-banner04.svg" alt="">
          <span class="banner-text small-text">##</span>
          <a href="/products/assessment" class="btn">Узнать больше</a>
        </div>`,
      b4: `
        <div class="banner privychki">
          <img src="/media/images/library/library-banner03.svg" alt="">
          <span class="banner-text small-text">##</span>
          <a href="/products/keyhabits" class="btn">Узнать больше</a>
        </div>`},
      tt = {
        b1: 'Исследование вовлеченности',
        b2: 'Корпоративная культура',
        b3: 'Развивающая оценка',
        b4: 'Обучение руководителей',
      },
      m = a.body.match(/##b\d@@[\w\d а-я.,;&?!]*##/gi);
    for(let i=0; i<m.length;m++) {
      let t = m[i].replace(/^##|##$/g, '').split('@@');
      if(t.length < 2 || t[1] === '') {
        t[1] = tt[t[0]];
      }
      let y = s[t[0]].replace(/##/g, t[1]);
      a.body = a.body.replace(new RegExp(m[i]), y);
    }
    return a;
  }

  let query = 'SELECT * FROM library_articles WHERE id=$1;',
    queryPars = [req.query.id];
  db.execute(query, queryPars)
  .then(r => {
    let a = r.rows[0];
    res.render('./admin/article_show.html', {
      a: renderPLinks(a),
      category: renderArticle(a),
    });
  })
  .catch(e => {
    console.error(e);
  });
});
