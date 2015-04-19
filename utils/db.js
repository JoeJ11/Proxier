var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var console = require('console');
var db = require('mongoskin').db('mongodb://localhost:27017/proxies');

function _list_all(ret) {
  db.collection('ssh').find().toArray(function(err, result) {ret(result);});
}

function _associate_ip(ip, ret) {
  db.collection('ssh').findAndModify({inuse: false}, [], {$set: {inuse: true}}, function(err, result) {
    if (result) {
      db.collection('ssh').findOne({_id: result._id}, function(err, port) {
        console.log('./bin/start.sh ' + ip + ' ' + port.port);
        //exec(String('./bin/start.sh ' + ip + ' ' + port.port), function(err, stdout) {
        //  console.log("There");
        //  db.collection('ssh').update({_id: result._id}, {$set: {ip: ip, pid: stdout.trim()}}, function(err, result) {
        //    console.log("Here");
        //    ret(stdout);
        //  });
        var x = execSync('./bin/start.sh ' + ip + ' ' + port.port);
        console.log(x);
        x = x.trim();
        db.conllection('ssh').update({_id: result._id}, {$set: {ip: ip, pid: x}});
        ret(x);
        //});
      });
    } else {
      ret('fail');
    } 
  });
}

function _release_ip(ip, ret) {
  db.collection('ssh').find({ip: ip}, function(err, port) {
    port.each(function() {
      exec('./bin/stop.sh ' + port.pid, function(error, stdout) {
        db.collection('ssh').update({_id: port._id}, {ip: '', pid: ''});
      });
    });
  });
  ret('Ha');
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
