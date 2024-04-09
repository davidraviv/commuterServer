const express = require('express');
const dotenv = require('dotenv').config();
const httpLogger = require('morgan');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger('dev'));

// Initialize DB
require('./utils/initDB')();

const echoRoute = require('./routes/echo.route');
const adminRoute = require('./routes/admin.route');
app.use('/echo', echoRoute);
app.use('/admin', adminRoute);

//404 handler and pass to error handler
app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});

//Error handler
app.use((err, req, res, next) => {
  const message = {
    error: {
      status: err.status || 500,
      message: err.message,
      error: err
    }
  }
  console.error(`Error handler. Message ${JSON.stringify(message, null, 2)}`);
  // log the stack trace of the err
  console.error(err.stack);
  res.status(err.status || 500);
  res.json(message);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server started on port ' + PORT + '...');
});
