const normalizeConfig = require('cogs/src/normalize-config');
const expect = require('chai').expect;
const fs = require('fs');
const getBuild = require('cogs/src/get-build');
const npath = require('npath');

const beforeEach = global.beforeEach;
const describe = global.describe;
const it = global.it;

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
              return promise.catch(er => {
                if (expectsError) expect(er).to.be.an.instanceOf(Error);
                else throw er;
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
