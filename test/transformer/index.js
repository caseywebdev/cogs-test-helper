module.exports = function (file, options, cb) {
  var source = file.buffer.toString();
  if (source === 'buz\n') return cb(new SyntaxError());
  cb(null, {
    buffer: new Buffer('bar\n'),
    globs: ['test/+(input).in']
  });
};
