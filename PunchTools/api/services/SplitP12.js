'use strict';

module.exports = {
  name: 'SplitP12',
  run: function (done) {
    var argv = require('optimist').argv;
    UtilitiesService.parseP12Certificate(argv.path, argv.password || '', function (err, cert, key) {
      var fs = require('fs');
      var path = require('path');
      console.log(cert);
      console.log(key);
      fs.writeFile(path.dirname(argv.path) + '/' + path.basename(argv.path, path.extname(argv.path)) + '.crt', cert, function (err) {
        if(err) {
          return done(err);
        }

        fs.writeFile(path.dirname(argv.path) + '/' + path.basename(argv.path, path.extname(argv.path)) + '.key', key, done); 
      });
    });
  }
};