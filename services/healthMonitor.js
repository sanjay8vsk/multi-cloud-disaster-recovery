const azure = require("../clouds/azure");
const aws = require("../clouds/aws");
const { setActiveServer } = require("./failover");

function startMonitoring() {
  setInterval(() => {
    const azureHealth = azure.health();
    const awsHealth = aws.health();

    if (!azureHealth || !awsHealth) {
        console.log("⚠️ Health check failed:", {
            Azure: azureHealth,
            Aws: awsHealth
        });
    }

    // Failover logic
    if (azureHealth) {
      setActiveServer(azure);
    } else if (awsHealth) {
      setActiveServer(aws);
    } else {
      console.log("⚠️ Both clouds are down!");
    }

  }, 3000); // every 3 seconds
}

module.exports = { startMonitoring };