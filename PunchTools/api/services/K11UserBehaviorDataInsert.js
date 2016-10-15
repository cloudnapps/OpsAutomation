'use strict';

var fs = require('fs');
var readline = require('readline');
var excel = require('excel-export');

module.exports = {
  name: 'K11UserBehaviorDataInsert',
  run: function (done) {
    var argv = require('optimist').argv;

    var from = new Date(argv.from);
    var to = new Date(argv.to);
    var output = argv.out;
    var query = {
      createdAt: {$gte: from, $lt: to},
      behavior: {$in: ['campaign:deliver', 'campaign:open']}
    };
    var behaviors;
    var results = [];
    var insertSQL = [];
    async.series([
      function (done) {
        console.log(query);
        UserBehavior.native(function (err, collection) {
          if (err) {
            return done(err);
          }

          collection.find(query, {
            _id: 1,
            userCustomerID: 1,
            deviceId: 1,
            createdAt: 1,
            behavior: 1,
            campaignId: 1,
            campaignName: 1,
            pushMsgId: 1,
            projectId: 1,
            projectName: 1,
            beaconId: 1,
            beaconName: 1,
            locationCustomFields: 1,
            campaignValidFrom: 1,
            strCampaignValidTo: 1,
            userTags: 1,
            appId: 1,
            appName: 1,
            channel: 1
          }).sort({_id: 1}).toArray(function (err, results) {
            if (err) {
              return done(err);
            }
            behaviors = _.each(results, function (behavior) {
              behavior.id = behavior._id.toString();
              behavior.createdAt = behavior.createdAt.toISOString();
              behavior.floor = (behavior.locationCustomFields || {}).floor;
              delete behavior._id;
            });

            console.log(behaviors.length);
            done();
          });
        });
      },
      function (done) {
        var lineReader = readline.createInterface({
          input: fs.createReadStream('/Users/xianlong/aaa.txt')
        });

        lineReader.on('line', function (line) {
          results.push(line);
        })
          .on('close', function () {
            done();
          })
      },
      function (done) {
        _.map(behaviors, function (behavior) {
          console.log(behavior.id);
          if (results.indexOf(behavior.id) === -1) {
            insertSQL.push(behavior.id);
          }
          else {
            console.log(behavior.id);
          }
        });

        done();
      }
    ], done);
  }
};