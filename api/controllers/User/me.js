module.exports = async function(req, res) {
  if (_.isUndefined(req.session.userId)) {
    return res.status(403).send('Not logged in');
  }

  User.findOne(req.session.userId).populate('players').then(user => {
    res.json(user);
  });
};
