'use strict';
var util = require('util');
var moment = require('moment');

module.exports = {
  name: 'K11UserBehaviorDataFix',
  run: function (done) {
    var from = new Date('2015/12/01');
    var to = new Date('2016/01/01');
    var targetRate = 0.2;
    var keepRate;
    var query = {
      createdAt: {$gte: from, $lt: to},
      appId: '564c0fface9b890d12d96b96',
      organizationId: '54c7bf4f97d9f2c7438fc096'
    };

    var deliverCount, openCount;
    async.series([
      function (done) {
        var deliverQuery = _.extend({}, query, {behavior: ['campaign:deliver']});
        UserBehavior.count(deliverQuery, function (err, count) {
          if(err) {
            return done(err);
          }
          deliverCount = count;
          done();
        });
      },
      function (done) {
        var openQuery = _.extend({}, query, {behavior: ['campaign:open']});
        UserBehavior.count(openQuery, function (err, count) {
          if(err) {
            return done(err);
          }
          openCount = count;
          done();
        });
      },
      function (done) {
        if(!deliverCount) {
          return done();
        }
        var currentRate = openCount / deliverCount;
        console.log(util.format('currentRate=%d/%d=%d', openCount, deliverCount, currentRate));
        if(currentRate < targetRate) {
          return done();
        }
        keepRate = targetRate / currentRate;
        done();
      },
      function (done) {
        if(!keepRate) {
          return done();
        }
        UtilitiesService.eachModelItem(UserBehavior, _.extend({}, query, {behavior: 'campaign:open'}), null, function (err, item) {
          if(err) {
            return done(err);
          }
          console.log(util.format('delete from UserBehavior where strMessageId = "%s" and strAppId = "%s" and strBehavior = "campaign:open" and strRecordTime = "%s";',
            item.pushMsgId, item.appId, moment(item.createdAt).format('YYYYMMDDHHmmss')
            ));
        }, done);
      },
      function (done) {
        UserBehavior.native(function (err, collection) {
          if(err) {
            return done(err);
          }
          collection.group(
            ['day'], 
            {createdAt: {$gte: from, $lt: to}, behavior: {$in: ['campaign:deliver', 'campaign:open']}, organizationId: '54c7bf4f97d9f2c7438fc096'},
            {
              delivers: 0,
              opens: 0,
              total: 0
            }, function (obj, prev) {
              prev.delivers += (obj.behavior === 'campaign:deliver') ? 1: 0;
              prev.opens += (obj.behavior === 'campaign:open') ? 1: 0;
              prev.total ++;
              prev.createdAt = obj.createdAt;
            },
            true,
            function (err, results) {
              results = _.sortBy(results, 'day');
              _.each(results, function (result) {
                result.day = moment(result.createdAt).format('YYYYMMDD');
                console.log(result.day + '\t' + result.delivers + '\t' + result.opens + '\t' + result.total);
              });
              done();
            });
        });
      },
      function (done) {
        UserBehavior.native(function (err, collection) {
          if(err) {
            return done(err);
          }
          collection.group(
            ['appName'], 
            {createdAt: {$gte: from, $lt: to}, behavior: {$in: ['campaign:deliver', 'campaign:open']}, organizationId: '54c7bf4f97d9f2c7438fc096'},
            {
              delivers: 0,
              opens: 0,
              total: 0
            }, function (obj, prev) {
              prev.delivers += (obj.behavior === 'campaign:deliver') ? 1: 0;
              prev.opens += (obj.behavior === 'campaign:open') ? 1: 0;
              prev.total ++;
              prev.createdAt = obj.createdAt;
            },
            true,
            function (err, results) {
              results = _.sortBy(results, 'appName');
              _.each(results, function (result) {
                console.log(result.appName + '\t' + result.delivers + '\t' + result.opens + '\t' + result.total);
              });
              done();
            });
        });
      }
      ], done);
    
  }
};