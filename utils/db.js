var spawn = require('child_process').spawn;
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
        var shellbox = spawn('shellinaboxd', ['-t', '-p', port.port, '--service=/:SSH:' + ip], {detached: true, stdio: 'ignore'});
        shellbox.unref();
        var pid = shellbox.pid;
        db.collection('ssh').update({_id: result._id}, {$set: {ip: ip, pid: pid}}, function() {
          ret(String(pid));
        });
      });
    } else {
      ret('fail');
    } 
  });
}

function _release_ip(ip, ret) {
  db.collection('ssh').find({ip: ip}, function(err, ports) {
    ports.map(function(port) {
      if (port.pid) {
        execSync('kill ' + port.pid, function(error, stdout) {
          db.collection('ssh').update({_id: port._id}, {ip: '', pid: ''});
        });
      }
    });
  });
  ret('Ha');
}

function _release_all() {
  db.collection('ssh').find().toArray(function(err, ports) {
    ports.map(function(port) {
      if (port.pid) {
        execSync('kill ' + port.pid, function(error, stdout) {
          db.collection('ssh').update({_id: port._id}, {ip: '', pid: ''});
        });
      }
    });
  });
}

exports.list_all = _list_all;
exports.associate_ip = _associate_ip;
exports.release_ip = _release_ip;
exports.release_all = _release_all;
