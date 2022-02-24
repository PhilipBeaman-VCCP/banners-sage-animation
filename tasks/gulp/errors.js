module.exports = function(errorObject, callback) {
  console.log('\n\n' + errorObject.toString().split(': ').join(':\n') + '\n\n');
  // Keep gulp from hanging on this task
  if (typeof this.emit === 'function') this.emit('end');
};
