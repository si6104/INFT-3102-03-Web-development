// Simple test to see if this data file runs
module.exports = function() {
  console.log("TEST DATA FILE IS RUNNING!");
  return {
    test: "This is a test",
    timestamp: new Date().toISOString()
  };
};
