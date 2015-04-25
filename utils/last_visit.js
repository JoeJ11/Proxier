var console = require('console');
var db = require('mongoskin').db('mongodb://localhost:27017/proxies')

db.bind('lastpage');

function _set_last(token, target, ret) {
    console.log(target);
    db.lastpage.update({token: token}, {$set: {target: target}},
		       {upsert: true}, function(err, result) {
			   ret();
		       });
}

function _get_last(token, ret) {
    db.lastpage.findOne({token: token}, function(err, entry) {
	if (err || !entry) { ret(err, ''); }
	else {
	    ret(null, entry.target);
	}
    });
}

exports.set_last = _set_last
exports.get_last = _get_last
