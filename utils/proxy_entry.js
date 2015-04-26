var crypto = require('crypto');
var db = require('mongoskin').db('mongodb://localhost:27017/proxies');

db.bind('entry');

function _list_all(ret) {
    db.entry.find().toArray(function(err, result) {
	ret(result);
    });
}

function _create_entry(proxy, target, token, ret) {
    var proxy_str = crypto.randomBytes(64).toString('hex');
    db.entry.insert({proxy: proxy_str, target: target, token: token}, function(err, result) {
	ret(result);
    })
}

function _delete_entry(target, ret) {
    db.entry.remove({target: target}, function(err) {
	if (err) ret('Failed');
	else ret('Success');
    });
}

function _find_target(proxy, ret) {
    db.entry.findOne({proxy: proxy}, function(err, entry) {
	if (err || !entry) ret(err, '');
	else ret(null, entry);
    });
}

exports.list_entries = _list_all
exports.find_target = _find_target
exports.create_entry = _create_entry
exports.delete_entry = _delete_entry


