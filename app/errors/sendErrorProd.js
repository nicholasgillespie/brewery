/* EXPORT //////////////////// */
export default (error, req, res) => {
  const { statusCode, message, status } = error;
  /* API //////////////////// */
  if (req.originalUrl.startsWith('/api')) {
  // OPERATIONAL ERRORS
    if (error.isOperational) {
      return res.status(statusCode).json({
        status,
        message,
      });
    }
    // PROGRAMMING ERRORS
    console.error('ERROR 💥', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
  /* RENDERED WEBSITE //////////////////// */
  // OPERATIONAL ERRORS
  if (error.isOperational) {
    return res.status(statusCode).render('template', {
      page: 'error',
      statusCode,
      message,
    });
  }
  // PROGRAMMING ERRORS
  console.error('ERROR 💥', error);
  return res.status(500).render('template', {
    page: 'error',
    message: 'Something went wrong. Please try again later.',
  });
};
