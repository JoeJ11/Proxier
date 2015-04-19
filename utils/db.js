var exec = require('child_process').exec;
var console = require('console');
var db = require('mongoskin').db('mongodb://localhost:27017/proxies');

function _list_all(ret) {
  db.collection('ssh').find().toArray(function(err, result) {ret(result);});
}

function _associate_ip(ip, ret) {
  db.collection('ssh').findAndModify({inuse: false}, [], {$set: {inuse: true}}, function(err, result) {
    if (result) {
      var port = db.collection('ssh').find({_id: result._id});
      exec('./bin/start.sh ' + ip, function(err, stdout) {
        db.collection('ssh').update({_id: result._id}, {$set: {ip: ip, pid: stdout.trim()}}, function(err, result) {
          ret(stdout);
        });
      });
    } else {
      ret('fail');
    } 
  });
}

function _release_ip(ip, ret) {
  db.collection('ssh').find({ip: ip}).forEach(function(port) {
    exec('./bin/stop.sh ' + port.pid, function(error, stdout) {
      db.collection('ssh').update({_id: port._id}, {ip: '', pid: ''});
    });
  });
}

function _release_all() {
  db.collection('ssh').update({}, {$set: {inuse: false, ip: '', pid: ''}}, {multi: true}, function(err, result) {
    //console.log(result);
  });
}

exports.list_all = _list_all;
exports.associate_ip = _associate_ip;
exports.release_ip = _release_ip;
exports.release_all = _release_all;
