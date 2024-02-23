const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  // Return and throw the error
  return error;
};

module.exports = createError;
