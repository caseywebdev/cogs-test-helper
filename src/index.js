import { strict as assert } from 'assert';
import fs from 'fs';
import npath from 'path';

import getBuild from 'cogs/src/get-build.js';
import normalizeConfig from 'cogs/src/normalize-config.js';

const NO_THROW_ERROR = new Error('Expected an error to be thrown');

export default {
  createTests: configs =>
    Object.fromEntries(
      Object.entries(configs).map(([configPath, builds]) => [
        `config [${configPath}]`,
        Object.fromEntries(
          Object.entries(builds).map(([path, expected]) => [
            `build [${path}] ${expected === Error ? 'fails' : 'succeeds'}`,
            async () => {
              const { default: main } = await import(npath.resolve(configPath));
              const env = (await normalizeConfig({ main })).main;
              try {
                const {
                  buffers: { 0: actual }
                } = await getBuild({ path, env });

                if (expected === Error) throw NO_THROW_ERROR;

                assert.equal(actual.toString(), expected.toString());
              } catch (er) {
                if (er === NO_THROW_ERROR || expected !== Error) throw er;

                assert.ok(er instanceof Error);
              }
            }
          ])
        )
      ])
    ),

  getFileBuffer: filePath => fs.readFileSync(filePath)
};
