// SecuritySection.tsx
import { useEffect, useState } from 'react';
import { SecurityData, PortData } from '../../types';
import SecurityOverviewIcon from './assets/security_overview_icon.png';
import PortIcon from './assets/port_icon.png';

export function SecuritySection() {
  const [securityData, setData] = useState<SecurityData | null>(null);
  const [openPorts, setOpenPorts] = useState<PortData[]>([])

  const fetchSecurityData = async () => {
    const fetchedData: SecurityData = await window.electron.getSecurityData();
    setData(fetchedData);
  };

  const fetchOpenPortsData = async () => {
    const ports: PortData[] = await window.electron.getOpenPortsData();
    setOpenPorts(ports);
  };

  useEffect(() => {
    fetchSecurityData();
    fetchOpenPortsData();
    // Refresh every 10 seconds
    const interval = setInterval(() => {
      fetchSecurityData();
      fetchOpenPortsData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!securityData) {
    return <div>Loading Security Data...</div>;
  }

  return (
    <div style={{ margin: '1rem' }}>
      <h2 style={{alignItems:"center", textAlign: "center", color: "#00A0CC", fontSize:"2.5rem"}}>
      <img 
        src={SecurityOverviewIcon}
        alt="Security Icon"
        style={{ width: "4.5rem", height: "4.5rem", opacity:"0.75", verticalAlign: "middle", padding:"1rem" }}
        />
        Security Overview
      </h2>
      <div className="dynamicTableContainer">
        <table className="dynamicTable">
          <thead>
            <tr>
              <th>Operating System and Software Updates</th>
              <th>Network Traffic Analysis</th>
              <th>Antivirus and Anti-malware Status</th>
              <th>Active Ports</th>
              <th>Last Malware Scan Date &amp; Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{securityData.osInfo}</td>
              <td>{securityData.networkTraffic}</td>
              <td>{securityData.antivirusStatus}</td>
              <td>{securityData.activePorts}</td>
              <td>{securityData.lastMalwareScan}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <h3 style={{ textAlign: "center", color: "#00A0CC", marginTop: '4rem', fontSize:"2.5rem" }}>
      <img 
        src={PortIcon}
        alt="Port Icon"
        style={{ width: "4.3rem", height: "4.3rem", opacity:"0.75", verticalAlign: "middle", padding:"0" }}
        />
        Open Ports Details</h3>
      <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '1rem' }}>
        <table className="dynamicTable">
          <thead>
            <tr>
              <th>Protocol</th>
              <th>Local Address</th>
              <th>Local Port</th>
              <th>Remote Address</th>
              <th>Remote Port</th>
              <th>State</th>
              <th>PID</th>
            </tr>
          </thead>
          <tbody>
            {openPorts.map((port, index) => (
              <tr key={index}>
                <td>{port.protocol}</td>
                <td>{port.localAddress}</td>
                <td>{port.localPort}</td>
                <td>{port.remoteAddress}</td>
                <td>{port.remotePort}</td>
                <td>{port.state}</td>
                <td>{port.pid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}