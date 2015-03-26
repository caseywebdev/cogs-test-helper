var helper = require('..');

helper.run({
  'test/config.json': {
    'test/input.in': {
      path: 'test/input.in',
      buffer: helper.getFileBuffer('test/output.out'),
      hash: helper.getFileHash('test/output.out'),
      requires: [{
        path: 'test/input.in',
        hash: helper.getFileHash('test/input.in')
      }],
      links: [],
      globs: [{
        path: 'test/+(input).in',
        hash: helper.getGlobHash('test/+(input).in')
      }]
    },
    'test/error.in': Error,
    'test/does-not-exist': Error
  }
});
