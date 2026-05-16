import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [health, setHealth] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [logs, setLogs] = useState([]);

  const API = "http://127.0.0.1:3000";

  const fetchData = async () => {
    try {
      const healthRes = await axios.get(`${API}/health`);
      const metricsRes = await axios.get(`${API}/metrics`);
      const logsRes = await axios.get(`${API}/logs`);

      setHealth(healthRes.data);
      setMetrics(metricsRes.data);
      setLogs(logsRes.data.reverse());
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, 0);

    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const failAzure = async () => {
    await axios.post(`${API}/fail/azure`);
    fetchData();
  };

  const recoverAzure = async () => {
    await axios.post(`${API}/recover/azure`);
    fetchData();
  };

  const generateRequest = async () => {
    await axios.get(`${API}/request`);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3">
            Multi-Cloud Disaster Recovery Dashboard
          </h1>

          <p className="text-slate-400 text-lg">
            Real-time failover monitoring across Azure and AWS
          </p>
        </div>

        {/* STATUS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Azure Cloud</h2>

            <div className={`text-2xl font-bold ${
              health?.azure ? "text-green-400" : "text-red-400"
            }`}>
              {health?.azure ? "Healthy" : "Down"}
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">AWS Cloud</h2>

            <div className={`text-2xl font-bold ${
              health?.aws ? "text-green-400" : "text-red-400"
            }`}>
              {health?.aws ? "Healthy" : "Down"}
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Active Cloud</h2>

            <div className="text-2xl font-bold text-cyan-400">
              {health?.active}
            </div>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-lg text-slate-400 mb-2">
              Total Requests
            </h2>

            <div className="text-4xl font-bold">
              {metrics?.totalRequests || 0}
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-lg text-slate-400 mb-2">
              Azure Requests
            </h2>

            <div className="text-4xl font-bold text-blue-400">
              {metrics?.perServer?.Azure || 0}
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-lg text-slate-400 mb-2">
              AWS Requests
            </h2>

            <div className="text-4xl font-bold text-orange-400">
              {metrics?.perServer?.AWS || 0}
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-wrap gap-4 mb-10">

          <button
            onClick={generateRequest}
            className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold transition"
          >
            Generate Request
          </button>

          <button
            onClick={failAzure}
            className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-semibold transition"
          >
            Simulate Azure Failure
          </button>

          <button
            onClick={recoverAzure}
            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold transition"
          >
            Recover Azure
          </button>
        </div>

        {/* LOGS */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">
              System Logs
            </h2>

            <div className="text-slate-400">
              Auto-refresh every 3 seconds
            </div>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">

            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div
                  key={index}
                  className="bg-slate-800 p-4 rounded-xl border border-slate-700"
                >
                  <div className="flex justify-between">

                    <span className="font-medium">
                      {log.message}
                    </span>

                    <span className="text-slate-400 text-sm">
                      {log.time}
                    </span>

                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400">
                No logs available
              </p>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;