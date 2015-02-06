var config = require('cogs/src/config');
var crypto = require('crypto');
var expect = require('chai').expect;
var fs = require('fs');
var getBuild = require('cogs/src/get-build');
var glob = require('glob');
var path = require('path');

var beforeEach = global.beforeEach;
var describe = global.describe;
var it = global.it;

exports.run = function (configs) {
  Object.keys(configs).forEach(function (configPath) {
    var builds = configs[configPath];

    describe(configPath, function () {
      beforeEach(function () {
        config.set(require(path.resolve(configPath)));
      });

      Object.keys(builds).forEach(function (inputPath) {
        var expected = builds[inputPath];

        describe(inputPath, function () {
          var expectsError = expected === Error;

          it(expectsError ? 'fails' : 'succeeds', function (cb) {
            getBuild(inputPath, function (er, build) {
              if (expectsError) expect(er).to.be.an.instanceOf(Error);
              else if (er) return cb(er);
              else expect(build).to.deep.equal(expected);
              cb();
            });
          });
        });
      });
    });
  });
};

exports.getHash = function (buffer) {
  var hash = crypto.createHash('md5');
  hash.end(buffer);
  return hash.read().toString('hex');
};

exports.getFileBuffer = function (filePath) {
  return fs.readFileSync(filePath);
};

exports.getFileHash = function (filePath) {
  return exports.getHash(exports.getFileBuffer(filePath));
};

exports.getGlobBuffer = function (pattern) {
  return JSON.stringify(glob.sync(pattern));
};

exports.getGlobHash = function (pattern) {
  return exports.getHash(exports.getGlobBuffer(pattern));
};
