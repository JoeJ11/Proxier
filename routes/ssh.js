var express = require('express');
var db = require('../utils/db');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res) {
  db.list_all(function(result) {
    res.send(result)
  });
});

router.get('/assign', function(req, res) {
  db.associate_ip('hahahaha', function(result) {
    res.send(result);
  });
});

router.get('/release', function(req, res) {
  db.release_ip('hahahaha', function(result) {
    res.send(result);
  }
});

router.get('/release-all', function(req, res) {
  db.release_all();
  res.send('Ha');
});

module.exports = router;
