let router = require('express').Router();

module.exports = router;

router.route('/')
  .get((req, res) => {
    res.render('./admin/library.html', {

    });
  });
