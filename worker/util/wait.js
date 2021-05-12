module.exports.wait = wait;


function wait(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};
