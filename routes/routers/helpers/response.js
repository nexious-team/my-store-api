module.exports = {
  200: (message = 'Success', payload = true) => ({
    message,
    payload,
  }),
  400: (error = 'Bad request') => ({
    error,
  }),
  401: (error = 'Unauthorized') => ({
    error,
  }),
  403: (error = 'Forbidden') => ({
    error,
  }),
  404: (error = 'Not found') => ({
    error,
  }),
};
