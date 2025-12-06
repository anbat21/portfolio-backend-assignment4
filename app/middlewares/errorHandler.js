module.exports = function(err, req, res, next){
  var status = err.status || 500;
  var payload = { status: status, message: err.message || 'Internal Server Error' };
  if (process.env.NODE_ENV !== 'production' && err.stack) payload.stack = err.stack;
  res.status(status).json(payload);
};
