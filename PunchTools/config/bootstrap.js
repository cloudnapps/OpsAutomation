/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(done) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  var commands = _.indexBy([K11UserBehaviorDataInsert, K11UserBehaviorDataFix, K11UserBehaviorData, SplitP12], 'name');
  var argv = require('optimist').argv;
  var command = commands[argv.command];
  if(!command) {
    return done();
  }

  command.run(function (err) {
    if(err) {
      console.error(err);
    }
    process.exit();
  });
};
