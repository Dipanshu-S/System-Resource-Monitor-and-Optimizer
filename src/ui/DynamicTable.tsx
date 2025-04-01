import { useEffect, useState } from 'react';

type AppData = {
  srNo: number;
  appName: string;
  currentCpuUsage: number;
  memoryConsumption: number;
  permissionsAllowed: string;
};

export function DynamicTable() {
  const [apps, setApps] = useState<AppData[]>([]);

  const fetchApps = async () => {
    // Calls the electron API exposed via preload to get running apps data.
    const data: AppData[] = await window.electron.getRunningApps();
    setApps(data);
  };

  useEffect(() => {
    fetchApps();
    // Refresh every 5 seconds
    const interval = setInterval(fetchApps, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dynamicTableContainer">
      <table className="dynamicTable">
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>App Name</th>
            <th>Current CPU Usage</th>
            <th>Memory Consumption</th>
            <th>Permissions Allowed</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app) => (
            <tr key={app.srNo}>
              <td>{app.srNo}</td>
              <td>{app.appName}</td>
              <td>{app.currentCpuUsage.toFixed(2)}%</td>
              <td>{app.memoryConsumption.toFixed(2)}%</td>
              <td>{app.permissionsAllowed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
