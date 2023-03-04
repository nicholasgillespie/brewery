/* EXPORT //////////////////// */
export default (error, req, res) => {
  console.error('ERROR 💥', error);
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      error,
      stack: error.stack,
    });
  }
  // RENDERED WEBSITE
  return res.status(404).render('template', {
    page: 'error',
    statusCode: error.statusCode,
    message: error.message,
  });
};
