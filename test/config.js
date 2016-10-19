module.exports = {
  transformers: {
    fn: ({file}) => {
      const source = file.buffer.toString();
      if (source === 'buz\n') throw new SyntaxError();

      return {
        buffer: new Buffer('bar\n'),
        globs: ['test/+(input).in']
      };
    },

    only: '**/*.in'
  }
};
