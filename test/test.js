var helper = require('..');

helper.run({
  'test/config.js': {
    'test/input.in': helper.getFileBuffer('test/output.out'),
    'test/error.in': Error,
    'test/does-not-exist': Error
  }
});
