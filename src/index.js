import { strict as assert } from 'node:assert';
import fs from 'node:fs/promises';
import nodePath from 'node:path';

import cogs from 'cogs';

const NO_THROW_ERROR = new Error('Expected an error to be thrown');

export default {
  createTests: configs =>
    Object.fromEntries(
      Object.entries(configs).map(([configPath, builds]) => [
        `config [${configPath}]`,
        Object.fromEntries(
          Object.entries(builds).map(([path, expectedPath]) => [
            `build [${path}] ${expectedPath === Error ? 'fails' : 'succeeds'}`,
            async () => {
              const { default: main } = await import(
                nodePath.resolve(configPath)
              );
              const env = (await cogs.normalizeConfig({ main })).main;
              try {
                const {
                  buffers: { 0: actual }
                } = await cogs.getBuild({ path, env });

                if (expectedPath === Error) throw NO_THROW_ERROR;

                let expected;
                try {
                  expected = await fs.readFile(expectedPath);
                  assert.equal(actual.toString(), expected.toString());
                } catch (er) {
                  if (er.code !== 'ENOENT') throw er;

                  console.log(`${expectedPath} not found, writing file...`);
                  await fs.writeFile(expectedPath, actual);
                }
              } catch (er) {
                if (er === NO_THROW_ERROR || expectedPath !== Error) throw er;

                assert.ok(er instanceof Error);
              }
            }
          ])
        )
      ])
    )
};
