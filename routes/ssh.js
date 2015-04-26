var express = require('express');
var request = require('request');
var console = require('console');
var proxydb = require('../utils/proxy_entry');
var lastdb = require('../utils/last_visit');
var router = express.Router();
/* GET home page. */


router.post('/thu-manage/create', function(req, res) {
    proxydb.create_entry(req.param('mode'), req.param('target'), req.param('token'), function(result) {
	res.send(result);
    });
});

router.post('/thu-manage/delete', function(req, res) {
    proxydb.delete_entry(req.param('target'), function(result) {
	res.send(result);
    });
});

router.get('/thu-manage', function(req, res) {
    proxydb.list_entries(function(result) {
	res.send(result);
    });
});
	   

router.use('/', function(req, res) {
    var pathlist = req.url.split('/');
    var proxy = pathlist[1];
    proxydb.find_target(proxy, function(err, entry) {
	if (err || !entry) {
	    var token = req.cookies['token'];
	    lastdb.get_last(token, function(err, target) {
		if (err || !target) {
		    res.send('Failed');
		} else {
		    //Add authentication
		    var url = target + req.url;
		    if (req.method == 'GET') {
			request.get(url).on('error', function(err) {
			    console.log(err)
			}).pipe(res);
		    } else if (req.method == 'POST') {
			console.log(req.body);
			request.post(url, {form: req.body}).on('error', function(err) {
			    console.log(err);
			}).pipe(res);
		    }
		}
	    });
	}
	else {
	    var url = entry.target + '/' + pathlist.slice(2).join('/');
	    lastdb.set_last(entry.token, entry.target, function() {
		if (req.method == 'GET') {
		    request.get(url, {auth: {user: 'thu_mooc',
					     pass: 'hellokitty'}}).on('response', function(response) {
						 response.headers['set-cookie'] = 'token='+entry.token;
					     }).on('error', function(err) {
						 console.log(err)
					     }).pipe(res);
		} else if (req.method == 'POST') {
		    request.post(url, {form: req.body,
				       auth: {user: 'thu_mooc',
					      pass: 'hellokitty'}}).on('response', function(response) {
						  response.headers['set-cookie'] = 'token='+entry.token;
					      }).on('error', function(err) {
						  console.log(err)
					      }).pipe(res);
		}
	    });
	}
    });
});

module.exports = router;
