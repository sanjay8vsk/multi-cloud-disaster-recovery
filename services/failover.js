const { recordFailover } = require("./logger");

let activeServer = null;

function setActiveServer(server) {
  if (!activeServer || activeServer.name !== server.name) {

    const previous = activeServer
      ? activeServer.name
      : "None";

    console.log(`Switching to ${server.name}`);

    recordFailover(previous, server.name);

    activeServer = server;
  }
}

function getActiveServer() {
  return activeServer;
}

module.exports = {
  setActiveServer,
  getActiveServer
};