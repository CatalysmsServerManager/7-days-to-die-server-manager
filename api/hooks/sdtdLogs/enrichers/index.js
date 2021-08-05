const enrichers = [
  require('./player'),
  require('./playerKilled'),
];

module.exports = async (event) => {
  try {
    const enriched = await Promise.all(enrichers.map(enricher => enricher(event)));
    return _.merge(event, ...enriched);
  } catch (error) {
    sails.log.warn('Error trying to enrich a log line, this should be OK to fail...');
    sails.log.error(e);
    return event;
  }
};
