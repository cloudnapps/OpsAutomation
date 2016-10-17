'use strict';

var fs = require('fs');
var xlsx = require('node-xlsx');
var moment = require('moment');
var os = require('os');

module.exports = {
  name: 'K11UserBehaviorDataInsert',
  run: function (done) {
    var argv = require('optimist').argv;

    var from = new Date(2016, 8, 1);
    var to = new Date(2016, 9, 1);
    var output = argv.out;
    var query = {
      createdAt: {$gte: from, $lt: to},
      behavior: {$in: ['campaign:deliver', 'campaign:open']}
    };
    var behaviors;
    var eventIds;
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
            locationName: 1,
            locationCustomFields: 1,
            campaignValidFrom: 1,
            strCampaignValidTo: 1,
            userTags: 1,
            appId: 1,
            appName: 1,
            channel: 1,
            sensor: 1
          }).toArray(function (err, results) {
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
        var xlsFilePath = '/Users/xianlong/aaa.xlsx';

        var sheets = xlsx.parse(xlsFilePath) || [];
        var dataSheet = sheets[0];
        if (!dataSheet) {
          res.json(4001, 'no sheet in input file');
        }

        var data = dataSheet.data;
        if (!data) {
          res.json(4001, 'no data in input sheet');
        }

        var head = data.shift();
        if (!head) {
          res.json(4001, 'no column head');
        }

        var results = _.map(data, function (row) {
          var eventId = row[1];
          return eventId.toString();
        });

        eventIds = _.reduce(results, function (result, id) {
          result[id] = id;
          return result;
        }, {});

        done();
      },
      function (done) {
        _.map(behaviors, function (behavior) {
          if (!eventIds[behavior.id]) {
            insertSQL.push(behavior);
          }
        });
        console.log(insertSQL.length);

        _.map(insertSQL, function (item) {
          var userTag = '';
          if (item.userTags) {
            userTag = item.userTags[0];
          }

          var createdAt = moment(item.createdAt).format('YYYY-MM-DD hh:mm:ss');
          var campaignValidFrom = moment(item.campaignValidFrom).format('YYYY-MM-DD hh:mm:ss');
          var campaignValidTo = moment(item.campaignValidTo).format('YYYY-MM-DD hh:mm:ss');

          function formatValue(value, toString, defaultValue) {
            if (toString) {
              if (defaultValue) {
                return value === undefined ? JSON.stringify(defaultValue) : JSON.stringify(value.toString());
              }
              else {
                return value === undefined ? '""' : JSON.stringify(value.toString());
              }
            }
            else {
              if (defaultValue) {
                return value === undefined ? JSON.stringify(defaultValue) : JSON.stringify(value);
              }
              else {
                return value === undefined ? '""' : JSON.stringify(value);
              }
            }
          }

          fs.appendFileSync(output, 'INSERT INTO beaconInfo(' +
            'VipCode, ' +
            'DeviceId, ' +
            'RecordTime, ' +
            'Behavior, ' +
            'CampaignId,' +
            'CampaignName, ' +
            'MessageId, ' +
            'ProjectId, ' +
            'ProjectName, ' +
            'BeaconId, ' +
            'BeaconName, ' +
            'Floor, ' +
            'CampaignValidFrom, ' +
            'CampaignValidTo, ' +
            'UserTags, ' +
            'AppId, ' +
            'AppName, ' +
            'Channel, ' +
            'Sensor, ' +
            'EventID' +
            ') VALUES (' +
            formatValue(item.userCustomerID) + ',' +
            formatValue(item.deviceId) + ',' +
            formatValue(createdAt) + ',' +
            formatValue(item.behavior) + ',' +
            formatValue(item.campaignId) + ',' +
            formatValue(item.campaignName) + ',' +
            formatValue(item.pushMsgId) + ',' +
            formatValue(item.projectId) + ',' +
            formatValue(item.projectName) + ',' +
            formatValue(item.beaconName) + ',' +
            formatValue(item.locationName) + ',' +
            formatValue(item.floor) + ',' +
            formatValue(campaignValidFrom) + ',' +
            formatValue(campaignValidTo) + ',' +
            formatValue(userTag) + ',' +
            formatValue(item.appId) + ',' +
            formatValue(item.appName) + ',' +
            formatValue(item.channel, true, "1") + ',' +
            formatValue(item.sensor, true, "1") + ',' +
            formatValue(item.id) +
            ')' + os.EOL);
        });
        done();
      }], done);
  }
}
;
