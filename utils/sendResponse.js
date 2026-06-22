const sendResponse = (
  res,
  { statusCode = 200, success = true, message = 'Success', data = null }
) => {
  res.status(statusCode).json({
    success,
    message,
    data,
  });
};

module.exports = sendResponse;
