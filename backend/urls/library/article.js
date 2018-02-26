/**
 * Отображение статьи
 */
'use strict';
const db = require('../../models/db.js'),
  fs = require('fs');

// рендер выбранной статьи
function renderArticle(a, req, res) {
  let model = {
      author: a.author,
      body: a.body,
      description: a.description,
      intro: a.intro,
      keywords: a.keywords,
      path: req.path,
      title: a.title,
      title_image_url: a.title_image_url,
      year: new Date().getFullYear(),
    },
    dateUpdate = new Date(a.date_update);
  // TODO: переписать нижеследующий код определения категории
  // <span class="item-mark korpkultura"><a href="#">Корпкультура</a></span>
  // вовлеченность
  if (a.category === 1) {
    model.category = '<span class="item-mark vovlechenost"><a href="/library/involvement">Вовлеченность</a></span>';
  }
  // идеология, она же полезные привычки
  if (a.category === 2) {
    model.category = '<span class="item-mark poleznye-privuchki"><a href="/library/ideology">Идеология</a></span>';
  }
  // корпоративная культура
  if (a.category === 3) {
    model.category = '<span class="item-mark korpkultura"><a href="/library/corporate_culture">Корпкультура</a></span>';
  }
  // оценка персонала
  if (a.category === 4) {
    model.category = '<span class="item-mark instrumenty-ocenki"><a href="/library/assessment">Оценка персонала</a></span>';
  }

  function renderPLinks(body) {
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
      m = body.match(/##b\d@@[\w\d а-я.,;&?!]*##/gi);
    if (!m) { return body; }
    for (let i = 0; i < m.length; m++) {
      let t = m[i].replace(/^##|##$/g, '').split('@@');
      if (t.length < 2 || t[1] === '') {
        t[1] = tt[t[0]];
      }
      let y = s[t[0]].replace(/##/g, t[1]);
      body = body.replace(new RegExp(m[i]), y);
    }
    return body;
  }

  // подмена плашек с ссылками на продукты
  model.body = renderPLinks(model.body);

  // вставка информации о предстоящих событиях
  // из файла /frontend/media/events.json
  function insertEvents() {
    let result = [];
    try {
      result = JSON.parse(fs.readFileSync('./frontend/media/events.json', 'utf8'));
    }
    catch (e) { }
    return result;
  }

  model.events = insertEvents();

  // подмена основной картинки
  try {
    fs.accessSync(`${global.__base}/frontend/media/imgs/library/${a.id}/${a.id}_head.png`, fs.constants.R_OK);
    model.head_img = `url(../media/imgs/library/${a.id}/${a.id}_head.png)`;
  }
  catch (e) {
    model.head_img = 'url(../media/imgs/library/head_img.png)';
  }

  // применение новых стилей библиотеки для статей
  // отредактированных после 27.02.17
  /* eslint-disable no-magic-numbers */
  if (dateUpdate.getFullYear() >= 2017) {
    res.render('./library/article.html', model);
  }
  /* eslint-enable no-magic-numbers */
  else {
    res.render('./library/article_old.html', model);
  }
}

exports.render = (req, res, next) => {
  // если запрос по id, т.е. вида /library/[число]
  if (req.byId) {
    let id = /^\/library\/(\d{1,4})$/.exec(req.path)[1];
    db.articles.findById(id) // выбираем статью по id
      .then((a) => renderArticle(a, req, res))
      .catch(() => next());
  }
  // если запрос по ссылке,
  // т.е. вида /library/[ссылка категории]/[ссылка статьи]
  // происходит 2 запроса к базе, что плохо, но, как временный вариант, пойдет
  else if (req.byLink) {
    let links = /^\/library\/([\w\d_]{1,50})\/([\w\d_]{1,100})$/.exec(req.path);
    /**
     * links[1] - ссылочное название категории
     * links[2] - ссылочное название статьи
     */
    /* eslint-disable no-magic-numbers */
    // получим id категории по ссылке
    db.libCats.findOne({ where: { link: `${links[1]}` } })
      // после выберем нужную статью по id категории и ссылке самой статьи
      .then((c) =>
        db.articles.findOne({
          where: { category: c.id, link: links[2] }
        })
          // выбранную статью срендерим
          .then((a) => renderArticle(a, req, res))
      )
      .catch(() => next());
    /* eslint-enable no-magic-numbers */
  }
};
