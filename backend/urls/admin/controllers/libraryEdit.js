let db = require(`../../../models/db`);
let sequelize = require('sequelize');
let pagination = require('pagination');

// function for show data for edit in library by id
exports.edit = function(req, res) {
  db.articles.findById(req.params.id)

  .then((a) => {
    res.render('admin/views/library_edit.html', {
      data: a,
      error: req.flash('error'),
      mata: {title: `Админ панель - редактирование - ${a.title}`}
    })
  })

  .catch(e => { next(e); })
};

// function to save the edited data in library by id
exports.editPost = function(req, res) {
  db.articles.update(
    {
      author     : req.body.author,
      body       : req.body.body,
      description: req.body.description,
      intro      : req.body.intro,
      keywords   : req.body.keywords,
      short_descr: req.body.short_descr,
      title      : req.body.title,
    },
    {where: {id: req.params.id}}
  )

  .then(() => {
    res.redirect(`/admin/library?page=${req.params.id || 1}`);
  })

  .catch(e => { next(e); })
};
