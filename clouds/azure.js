let isHealthy = true;

module.exports = {
  name: "Azure",

  health: () => isHealthy,

  simulateFailure: () => {
    isHealthy = false;
  },

  recover: () => {
    isHealthy = true;
  },

  handleRequest: () => {
    return {
      server: "Azure",
      message: "Response from Azure Cloud"
    };
  }
};