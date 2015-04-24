var express = require('express');
var request = require('request');
var console = require('console');
var db = require('../utils/db');
var router = express.Router();
/* GET home page. */

router.use('/', function(req, res) {
    var url = 'http://172.16.9.245:4200' + req.url;
    if (req.method == 'GET') {
	request.get(url).pipe(res);
    } else if (req.method == 'POST') {
	request.post(url, {form: req.body}).pipe(res);
    }
});

// router.get('/', function(req, res) {
//   db.list_all(function(result) {
//     res.send(result)
//   });
// });

// router.get('/assign', function(req, res) {
//   db.associate_ip('10.10.10.10', function(result) {
//     res.send(result);
//   });
// });

// router.get('/release', function(req, res) {
//   db.release_ip('10.10.10.10', function(result) {
//     res.send(result);
//   });
// });

// router.get('/release-all', function(req, res) {
//   db.release_all();
//   res.send('Ha');
// });

module.exports = router;
