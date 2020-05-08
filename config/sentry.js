module.exports.sentry = {
  active: !!process.env.SENTRY_DSN,
  dsn: process.env.SENTRY_DSN,
  options: {
    environment: process.env.NODE_ENV || 'development'
  }
};
