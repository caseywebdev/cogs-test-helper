import { strict as assert } from 'assert';
import fs from 'fs';
import nodePath from 'path';

import cogs from 'cogs';

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
              const { default: main } = await import(
                nodePath.resolve(configPath)
              );
              const env = (await cogs.normalizeConfig({ main })).main;
              try {
                const {
                  buffers: { 0: actual }
                } = await cogs.getBuild({ path, env });

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
