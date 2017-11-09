'use strict';

const crypto = require('crypto'),
  router = require('express').Router();

module.exports = router;

router.route('/')
.get((req, res) => {
  let iterations = 50000,
    keylen = 128;
  return crypto.pbkdf2(req.query.pwd, req.query.salt, iterations, keylen, 'sha512', (err, key) => {
    if(err) { console.error(err); }
    res.render('./admin/hash.html', {
      // hash: key.toString('hex')
    });
  });
});
