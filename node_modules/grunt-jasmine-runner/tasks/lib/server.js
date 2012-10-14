var connect = require('connect'),
    path = require('path');

exports.start = function(base, port, options) {
  base = path.resolve(base);

  var server = connect();

  if (options.debug) {
    connect.logger.format('grunt', ('[D] local server :method :url :status ' + ':res[content-length] - :response-time ms').magenta);
    server.use(connect.logger('grunt'));
  }

  server.use(connect.static(base));
  server.use(connect.directory(base));

  return server.listen(port);
};

