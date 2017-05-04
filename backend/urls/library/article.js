/**
 * Отображение статьи
 */
'use strict';
const db = require('../../models/db.js');

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
  if(a.category === 1) {
    model.category = '<span class="item-mark vovlechenost"><a href="/library/involvement">Вовлеченность</a></span>';
  }
  // идеология, она же полезные привычки
  if(a.category === 2) {
    model.category = '<span class="item-mark poleznye-privuchki"><a href="/library/ideology">Идеология</a></span>';
  }
  // корпоративная культура
  if(a.category === 3) {
    model.category = '<span class="item-mark korpkultura"><a href="/library/corporate_culture">Корпкультура</a></span>';
  }
  // оценка персонала
  if(a.category === 4) {
    model.category = '<span class="item-mark instrumenty-ocenki"><a href="/library/assessment">Оценка персонала</a></span>';
  }
console.log(dateUpdate)
  // применение новых стилей библиотеки для статей
  // отредактированных после 27.02.17
  /* eslint-disable no-magic-numbers */
  if(dateUpdate.getFullYear() >= 2017
    && dateUpdate.getMonth() >= 1) {
    res.render('./library/article.html', model);
  }
  /* eslint-enable no-magic-numbers */
  else {
    res.render('./library/article_old.html', model);
  }
}

exports.render = (req, res, next) => {
  // если запрос по id, т.е. вида /library/[число]
  if(req.byId) {
    let id = /^\/library\/(\d{1,4})$/.exec(req.path)[1];
    db.articles.findById(id)  // выбираем статью по id
    .then((a) => renderArticle(a, req, res))
    .catch(() => next());
  }
  // если запрос по ссылке,
  // т.е. вида /library/[ссылка категории]/[ссылка статьи]
  // происходит 2 запроса к базе, что плохо, но, как временный вариант, пойдет
  else if(req.byLink) {
    let links = /^\/library\/([\w\d_]{1,50})\/([\w\d_]{1,100})$/.exec(req.path);
    /**
     * links[1] - ссылочное название категории
     * links[2] - ссылочное название статьи
     */
    /* eslint-disable no-magic-numbers */
    // получим id категории по ссылке
    db.libCats.findOne({ where: {link: `${links[1]}`}})
      // после выберем нужную статью по id категории и ссылке самой статьи
    .then((c) =>
      db.articles.findOne({
        where: {category: c.id, link: links[2]}
      })
      // выбранную статью срендерим
      .then((a) => renderArticle(a, req, res))
    )
    .catch(() => next());
    /* eslint-enable no-magic-numbers */
  }
};
