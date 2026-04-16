let isHealthy = true;

module.exports = {
  name: "AWS",

  health: () => isHealthy,

  simulateFailure: () => {
    isHealthy = false;
  },

  recover: () => {
    isHealthy = true;
  },

  handleRequest: () => {
    return {
      server: "AWS",
      message: "Response from AWS Cloud"
    };
  }
};