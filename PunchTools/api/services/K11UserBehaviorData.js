'use strict';
var util = require('util');
var moment = require('moment');
var fs = require('fs');
var excel = require('excel-export');

module.exports = {
  name: 'K11UserBehaviorData',
  run: function (done) {
    var argv = require('optimist').argv;

    var from = new Date(argv.from);
    var to = new Date(argv.to);
    var output = argv.out;
    var query = {
      createdAt: {$gte: from, $lt: to},
      behavior: {$in: ['campaign:deliver', 'campaign:open']},
      organizationId: '54c7bf4f97d9f2c7438fc096'
    };
    var behaviors;
    async.series([
      function (done) {
        console.log(query);
        UserBehavior.native(function (err, collection) {
          if(err) {
            return done(err);
          }
          collection.find(query, {
            behavior: 1,
            channel: 1,
            campaignId: 1,
            campaignName: 1,
            projectId: 1,
            projectName: 1,
            locationId: 1,
            locationName: 1,
            deviceId: 1,
            deviceType: 1,
            deviceModel: 1,
            appId: 1,
            appName: 1,
            userCustomerID: 1,
            'locationCustomFields.floor': 1,
            os: 1,
            osVersion: 1,
            beaconId: 1,
            beaconName: 1,
            pushMsgId: 1,
            createdAt: 1
          }).sort({_id: 1}).toArray(function (err, results) {
            if(err) {
              return done(err);
            }
            behaviors = _.each(results, function (behavior) {
              behavior.id = behavior._id.toString();
              behavior.createdAt = behavior.createdAt.toISOString();
              behavior.floor = (behavior.locationCustomFields || {}).floor;
              delete behavior._id;
            });
            done();
          });
        });
      },
      function (done) {
        var conf ={};
        // conf.stylesXmlFile = 'styles.xml';

        conf.cols = [
        {
          caption:'id',
          type:'string',
          width:28.7109375
        },
        {
          caption:'behavior',
          type:'string',
          width:28.7109375
        },
        {
          caption:'channel',
          type:'number',
          width:28.7109375
        },
        {
          caption:'campaignId',
          type:'string',
          width:28.7109375
        },
        {
          caption:'campaignName',
          type:'string',
          width:28.7109375
        },
        {
          caption:'projectId',
          type:'string',
          width:28.7109375
        },
        {
          caption:'projectName',
          type:'string',
          width:28.7109375
        },

        {
          caption:'locationId',
          type:'string',
          width:28.7109375
        },
        {
          caption:'locationName',
          type:'string',
          width:28.7109375
        },
        {
          caption:'userCustomerID',
          type:'string',
          width:28.7109375
        },
        {
          caption:'deviceId',
          type:'string',
          width:28.7109375
        },
        {
          caption:'deviceType',
          type:'string',
          width:28.7109375
        },
        {
          caption:'deviceModel',
          type:'string',
          width:28.7109375
        },
        {
          caption:'os',
          type:'string',
          width:28.7109375
        },
        {
          caption:'osVersion',
          type:'string',
          width:28.7109375
        },
        {
          caption:'appId',
          type:'string',
          width:28.7109375
        },
        {
          caption:'appName',
          type:'string',
          width:28.7109375
        },          
        {
          caption:'floor',
          type:'string',
          width:28.7109375
        },
        {
          caption:'beaconId',
          type:'string',
          width:28.7109375
        },
        {
          caption:'beaconName',
          type:'string',
          width:28.7109375
        },
        {
          caption:'pushMsgId',
          type:'string',
          width:28.7109375
        },
        {
          caption:'createdAt',
          type:'string',
          width:28.7109375
        }];

        conf.rows = _.map(behaviors, function (behavior) {
          var row = _.map(conf.cols, function (col) {
            return behavior[col.caption] || '';
          });
          return row;
        });

        var result = excel.execute(conf);
        var resultStream = fs.createWriteStream(output);
        result.pipe(resultStream);
        resultStream.on('close', done);
      }
    ], done);
  }
};