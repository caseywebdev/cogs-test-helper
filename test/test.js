import helper from '../src/index.js';

export default helper.createTests({
  'test/config.js': {
    'test/input.in': 'test/output.out',
    'test/error.in': Error,
    'test/does-not-exist': Error
  }
});
