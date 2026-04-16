const express = require("express");
const cors = require("cors");

const azure = require("./clouds/azure");
const aws = require("./clouds/aws");

const { startMonitoring } = require("./services/healthMonitor");
const { getActiveServer, setActiveServer } = require("./services/failover");

// ✅ ADD THIS
const { addLog, incrementRequests, getLogs, getMetrics } = require("./services/logger");

const app = express();
app.use(cors());


setActiveServer(azure); // Start with Azure as active
// Start monitoring
startMonitoring();


// ✅ HEALTH ROUTE
app.get("/health", (req, res) => {
  res.json({
    azure: azure.health(),
    aws: aws.health(),
    active: getActiveServer()?.name || "None"
  });
});


// ✅ FAIL + RECOVER
app.post("/fail/azure", (req, res) => {
  azure.simulateFailure();
  res.json({ message: "Azure failed" });
});

app.post("/recover/azure", (req, res) => {
  azure.recover();
  res.json({ message: "Azure recovered" });
});


// 🔥 UPDATE THIS ROUTE


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


// 🔥 ADD THIS (LOGS API)
app.get("/logs", (req, res) => {
  res.json(getLogs());
});


// 🔥 ADD THIS (METRICS API)
app.get("/metrics", (req, res) => {
  res.json(getMetrics());
});


app.listen(5001, () => {
  console.log("Server running on port 5001");
});