let logger = console;


if(process.env.NODE_ENV === 'test') {
  const NOOP = () => {};
  logger = {
    error: NOOP,
    info: NOOP,
    log: NOOP,
    warn: NOOP,
  };
}

module.exports = {
  logger
};
