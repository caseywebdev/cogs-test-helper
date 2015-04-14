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

// HACK: https://github.com/mochajs/mocha/issues/1241
// The maintainer says this was fixed, but it's still broke in v2.2.4...
var utils = require('mocha/lib/utils');
var stringify = utils.stringify;
utils.stringify = function (value) {
  return typeof value === 'string' ? value : stringify(value);
};

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
              else {

                // Chai doesn't do a good job of diffing nested node Buffers, so
                // check just the buffers first (which it diffs just fine), then
                // check the entire build.
                expect('' + build.buffer).to.equal('' + expected.buffer);
                expect(build).to.deep.equal(expected);
              }
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
