function wrapAsync(fu) {
  return function (req, res, next) {
    fu(req, res, next).catch(next);
  };
}

module.exports = wrapAsync;
