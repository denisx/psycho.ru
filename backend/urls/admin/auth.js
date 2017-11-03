'use strict';

let router = require('express').Router();

module.exports = router;

router.route('/login')
.get((req, res) => {
  res.render('./admin/login.html', {

  });
});
