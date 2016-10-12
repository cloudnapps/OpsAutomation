'use strict';

var svc = module.exports = {
  minimumMongoObjectID: '000000000000000000000000',
  eachModelItem: function (model, query, options, iterator, done) {
    var completed = false;
    var lastId = UtilitiesService.minimumMongoObjectID;
    options = _.extend({batchSize: 100}, options);
    async.whilst(
      function () {
        return !completed;
      },
      function (done) {
        var _query = _.extend({}, query, {id: {'>': lastId}});
        model.find(_query).sort({_id:1}).limit(options.batchSize).exec(function (err, items) {
          console.log('batch start from: ' + (items[0]||{}).id);
          if(err) {
            return done(err);
          }
          if(items.length === 0) {
            completed = true;
            return done();
          }
          lastId = items[items.length - 1].id;

          async.each(items, iterator, done);
        });
      }, done);
  },
  execShellCommand: function (command, args, stdinData, done) {
    var spawn = require('child_process').spawn,
      child = spawn(command, args), stdoutContent = '', stderrContent = '';
    child.stdout.on('data', function (data) {
      stdoutContent += data;
    });

    child.stderr.on('data', function (err) {
      stderrContent += err;
    });

    child.on('exit', function (code) {
      done(code, stderrContent, stdoutContent);
    });
    if(stdinData) {
      child.stdin.write(stdinData);
    }
    return child;
  },
  readP12Certificate: function (path, password, done) {
    svc.execShellCommand(
      'openssl',
      ['pkcs12', '-info', '-in', path, '-nodes', '-passin', 'pass:' + password],
      null,
      function (code, err, data) {
        if(code) {
          done(err);
        } else {
          done(null, data);
        }
      }
    );
  },
  parseP12Certificate: function (path, password, done) {
    svc.readP12Certificate(path, password, function (err, content) {
      if(err) {
        return done(err);
      }
      var start = content.indexOf('-----BEGIN CERTIFICATE-----'), endTag = '-----END CERTIFICATE-----', end = content.indexOf(endTag),
        cert = content.substring(start, end + endTag.length) + '\n';

      svc.execShellCommand('openssl', ['x509', '-noout', '-startdate', '-enddate'], cert, function (code, err, data) {
        if(code) {
          return done(err);
        }
        var lines = data.split('\n'),
          startDate = (lines[0] || '').substring((lines[0] || '').indexOf('=') + 1),
          endDate = (lines[1] || '').substring((lines[1] || '').indexOf('=') + 1);
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        done(null, cert, content, startDate, endDate);
      });
    });
  }
};