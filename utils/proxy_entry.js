var db = require('mongoskin').db('mongodb://localhost:27017/proxies')

db.bind('entry');

function _list_all(ret) {
    db.entry.find().toArray(function(err, result) {
	ret(result);
    });
}

function _create_entry(proxy, target, token, ret) {
    db.entry.insert({proxy: proxy, target: target, token: token}, function(err, result) {
	ret(result);
    })
}

function _delete_entry(target, ret) {
    db.entry.remove({target, target}, function(err) {
	if (err) ret('Failed');
	else ret('Success');
    });
}

exports.list_entries = _list_all
exports.create_entry = _create_entry
exports.delete_entry = _delete_entry


