const fs = require('fs');

const expect = require('chai').expect;
const getBuild = require('cogs/src/get-build');
const normalizeConfig = require('cogs/src/normalize-config');
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
        const main = require(npath.resolve(configPath));
        env = normalizeConfig({ main }).main;
      });

      Object.keys(builds).forEach(path => {
        const expected = builds[path];

        describe(path, () => {
          const expectsError = expected === Error;

          it(expectsError ? 'fails' : 'succeeds', async () => {
            try {
              const {
                buffers: { 0: actual }
              } = await getBuild({ path, env });

              if (expectsError) throw NO_THROW_ERROR;

              expect(actual.toString()).to.equal(expected.toString());
            } catch (er) {
              if (er === NO_THROW_ERROR || !expectsError) throw er;

              expect(er).to.be.an.instanceOf(Error);
            }
          });
        });
      });
    });
  });
};

exports.getFileBuffer = filePath => fs.readFileSync(filePath);
