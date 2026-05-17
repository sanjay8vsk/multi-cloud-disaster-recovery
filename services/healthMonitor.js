const azure = require("../clouds/azure");
const aws = require("../clouds/aws");

const { setActiveServer } = require("./failover");

function startMonitoring() {
  setInterval(() => {

    const azureHealth = azure.health();
    const awsHealth = aws.health();

    console.log("Health Status:", {
      Azure: azureHealth,
      AWS: awsHealth
    });

    // If Azure healthy → prefer Azure
    if (azureHealth) {
      setActiveServer(azure);
    }

    // If Azure down but AWS healthy
    else if (awsHealth) {
      setActiveServer(aws);
    }

    // Both down
    else {
      console.log("⚠️ Both clouds are down!");
    }

  }, 3000);
}

module.exports = { startMonitoring };