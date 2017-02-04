const normalizeConfig = require('cogs/src/normalize-config');
const expect = require('chai').expect;
const fs = require('fs');
const getBuild = require('cogs/src/get-build');
const npath = require('npath');

const beforeEach = global.beforeEach;
const describe = global.describe;
const it = global.it;

const NO_THROW_ERROR = new Error('Expected an error to be thrown');

exports.run = configs => {
  Object.keys(configs).forEach(configPath => {
    const builds = configs[configPath];

    describe(configPath, () => {
      let env;

      beforeEach(() => {
        env = normalizeConfig(require(npath.resolve(configPath))).envs[0];
      });

      Object.keys(builds).forEach(path => {
        const expected = builds[path];

        describe(path, () => {
          const expectsError = expected === Error;

          it(expectsError ? 'fails' : 'succeeds', () => {
            const promise = getBuild({path, env});
            if (expectsError) {
              return promise
                .then(() => { throw NO_THROW_ERROR; })
                .catch(er => {
                  if (er === NO_THROW_ERROR) throw er;

                  expect(er).to.be.an.instanceOf(Error);
                });
            }

            return promise.then(build => {
              expect(build.toString()).to.equal(expected.toString());
            });
          });
        });
      });
    });
  });
};

exports.getFileBuffer = filePath => fs.readFileSync(filePath);
