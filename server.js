const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const azure = require("./clouds/azure");
const aws = require("./clouds/aws");

const { startMonitoring } = require("./services/healthMonitor");
const { getActiveServer, setActiveServer } = require("./services/failover");

const {
  addLog,
  incrementRequests,
  getLogs,
  getMetrics
} = require("./services/logger");

const { PORT } = require("./config/constants");

// Start with Azure as active
setActiveServer(azure);

// Start monitoring
startMonitoring();


// HEALTH ROUTE
app.get("/health", (req, res) => {
  res.json({
    azure: azure.health(),
    aws: aws.health(),
    active: getActiveServer()?.name || "None"
  });
});


// FAIL AZURE
app.post("/fail/azure", (req, res) => {
  azure.simulateFailure();
  res.json({ message: "Azure failed" });
});


// RECOVER AZURE
app.post("/recover/azure", (req, res) => {
  azure.recover();
  res.json({ message: "Azure recovered" });
});


// HANDLE REQUESTS
app.get("/request", (req, res) => {
  const active = getActiveServer();

  if (!active) {
    return res.status(500).json({ error: "No active server" });
  }

  incrementRequests(active.name);
  addLog(`Request served by ${active.name}`);

  const response = active.handleRequest();

  res.json(response);
});


// LOGS API
app.get("/logs", (req, res) => {
  res.json(getLogs());
});


// METRICS API
app.get("/metrics", (req, res) => {
  res.json(getMetrics());
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});