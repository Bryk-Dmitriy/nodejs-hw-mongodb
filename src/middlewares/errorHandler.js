export const errorHandler = (error, req, res, next) => {
  const { status = 500 } = error;
  res.status(status).json({
    status: status,
    message: 'Something went wrong',
  });
};
