// services/logger.js

let logs = [];

let metrics = {
  totalRequests: 0,
  perServer: {
    Azure: 0,
    AWS: 0
  },
  failovers: 0,
  history: []
};

// Add log entry
function addLog(message) {
  logs.push({
    message,
    time: new Date().toLocaleTimeString()
  });
}

// Increment request count
function incrementRequests(serverName) {
  metrics.totalRequests++;

  if (!metrics.perServer[serverName]) {
    metrics.perServer[serverName] = 0;
  }

  metrics.perServer[serverName]++;
}

// Record failover event
function recordFailover(from, to) {
  metrics.failovers++;

  const event = {
    from,
    to,
    time: new Date().toISOString()
  };

  metrics.history.push(event);

  // Also log it
  addLog(`Failover: ${from} → ${to}`);
}

// Get logs
function getLogs() {
  return logs;
}

// Get metrics
function getMetrics() {
  return metrics;
}

// Export everything
module.exports = {
  addLog,
  incrementRequests,
  recordFailover,
  getLogs,
  getMetrics
};