import { useEffect, useMemo, useState } from 'react';  
import Icon from './assets/icon.png'; 
import './App.css';
import { useStatistics } from './useStatistics';
import { Chart } from './Chart';
import { StaticData, View } from '../../types';
import { BaseChart } from './BaseChart';
import { DynamicTable } from './DynamicTable';
import MenuIcon from './assets/menu_icon.png';
import CloseIcon from './assets/close_icon.png';
import SecurityIcon from './assets/security_icon.png';
import { SecuritySection } from './SecuritySection';
import { SettingsSection } from './SettingsSection';


function App() {
  const staticData = useStaticData();
  const batteryData = useBatteryData();
  const [count, setCount] = useState(0);
  const [setStaticData] = useState<any>(null); // define staticData state
  const statistics = useStatistics(10);
  const [activeView, setActiveView] = useState<View>('CPU');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'security' | 'settings'>('dashboard');
  const cpuUsages = useMemo(
    () => statistics.map((stat) => stat.cpuUsage),
    [statistics]
  );
  const ramUsages = useMemo(
    () => statistics.map((stat) => stat.ramUsage),
    [statistics]
  );
  const storageUsages = useMemo(
    () => statistics.map((stat) => stat.storageUsage),
    [statistics]
  );

  const activeUsage = useMemo(() => {
    switch (activeView) {
      case "CPU":
        return cpuUsages;
      case "RAM":
        return ramUsages;
      case "STORAGE":
        return storageUsages;
    }
  }, [activeView, cpuUsages, ramUsages , storageUsages]);

  useEffect(() => {
    return window.electron.subscribeChangeView((view) => setActiveView(view));
  }, []);

  const showSidebar = () => {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    if (sidebar) {
      sidebar.style.display = 'flex';
    }
  };

  const hideSidebar = () => {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    if (sidebar) {
      sidebar.style.display = 'none';
    }
  };

  console.log(statistics);

  return (
    <div className="App"> 
    <Header />
    <div className="title">
      <center><h3>ApexSys : The Unified System Management</h3></center>
    </div>
    <nav>
      <ul className="sidebar">
       <li onClick={() => { hideSidebar(); setActiveSection('dashboard'); }}>
          <a href="#">
             <img  src={CloseIcon} alt="Close Icon" width="36" height="36"/>
          </a>
        </li>
        <li onClick={() => { hideSidebar(); setActiveSection('dashboard'); }}>
          <a href="#">DashBoard</a>
        </li>
        <li onClick={() => { hideSidebar(); setActiveSection('security'); }}>
          <a href="#">Security</a>
        </li>
        <li onClick={() => { hideSidebar(); setActiveSection('settings'); }}>
          <a href="#">Settings</a>
        </li>
      </ul>
      <ul>
        <li onClick={showSidebar}>
          <a href="#">
             <img  src={MenuIcon} alt="Menu Icon" width="36" height="36"/>
          </a>
        </li>
      </ul>
    </nav>
    {/* Conditional Rendering Based on Active Section */}
    {activeSection === 'dashboard' && (
        <>
          <div className="main">
            <div className="resourceTitle"><h2>Core Resources</h2></div>
            <div className="batteryStatusTitle"><h2>Battery Stats</h2></div> 
            <div className="smallCharts">
              <div>
                <SelectOption
                  onClick={() => setActiveView('CPU')} 
                  title="CPU"
                  view="CPU"
                  subTitle={staticData?.cpuModel ?? ''}
                  data={cpuUsages} 
                />
                <SelectOption 
                  onClick={() => setActiveView('RAM')}
                  title="RAM"
                  view="RAM"
                  subTitle={(staticData?.totalMemoryGB?.toString() ?? '') + ' GB'}
                  data={ramUsages}
                />
                <SelectOption 
                  title="STORAGE"
                  onClick={() => setActiveView('STORAGE')}
                  view="STORAGE"
                  subTitle={(staticData?.totalStorage?.toString() ?? '') + ' GB'}
                  data={storageUsages}
                />
              </div> 
            </div>
            <div className="mainGrid">
              <Chart 
                selectedView={activeView} 
                data={activeUsage} 
                maxDataPoints={10}
              />
            </div>
            <div className="powerManagement">
              <PowerManagementSection />
            </div>
          </div>
          {/* Active Applications Section */}
          <div className="dynamicTableSection">
            <h2 style={{ textAlign: "center", color: "#00A0CC", margin: "1rem 1", marginLeft: "5rem" }}>Active Applications</h2>
            <DynamicTable />
          </div>
        </>
      )}
      
      {activeSection === 'security' && (
       <div style={{ margin: '1rem' }}>
         <h2 style={{ display: "flex", alignItems: "center", textAlign: "left", marginLeft: "5rem", fontSize: "3rem", marginTop: "0.5rem", color: "#00A0CC" }}>
            <img
              src={SecurityIcon}
              alt="Security Icon"
              style={{ width: "6rem", height: "6rem", marginRight: "1rem", opacity:"0.85" }}
            />
            Security Page
         </h2>
         <SecuritySection />
       </div>
      )}

      {activeSection === 'settings' && (
        <div style={{ margin: '1rem' }}>
          <SettingsSection />
        </div>
      )}
    </div>
  );
}

function SelectOption(props: { 
  title: string;
  view: View; 
  subTitle: string;
  data: number [];
  onClick: () => void;
}) {
  return (
  <button className="selectOption" onClick={props.onClick}>
    <div className="selectOptionTitle">
    <div>{props.title}</div>
    <div>{props.subTitle}</div>
    </div>
    <div className='selectOptionChart'>
    <Chart 
      selectedView={props.view} 
      data = {props.data} 
      maxDataPoints={10}
    />
    </div>
    </button>
  );
}

function Header() {
  return (
    <header>
        <button
        id="close"
        onClick={() => window.electron.sendFrameAction('CLOSE')}
      />
      <button
        id="minimize"
        onClick={() => window.electron.sendFrameAction('MINIMIZE')}
      />
      <button
        id="maximize"
        onClick={() => window.electron.sendFrameAction('MAXIMIZE')}
      />
    </header>
  );
}

function useBatteryData() {
  const [batteryData, setBatteryData] = useState<{ history: number[]; isCharging: boolean } | null>(null);
  useEffect(() => {
    (async () => {
      const data = await window.electron.getBatteryData();
      setBatteryData(data);
    })();
  }, []);
  return batteryData;
}

function PowerManagementSection() {
  const batteryData = useBatteryData();

  return (
    <div className="powerManagement">
      {batteryData ? (
        <>
          <BatteryChart data={batteryData.history} />
          <div className="batteryStatus">
            {batteryData.isCharging ? "Charging" : <h4>Not Plugged In</h4>}
          </div>
        </>
      ) : (
        <div className="batteryStatus">No Battery Data</div>
      )}
    </div>
  );
}

function BatteryChart({ data }: { data: number[] }) {
  const chartData = data.map(percent => ({ value: percent }));
  return (
    <div style={{ height: "100%" }}>
      <BaseChart data={chartData} fill="#00CCD7" stroke="#00CCBE" />
    </div>
  );
}


function useStaticData() {
  const [staticData, setStaticData] = useState<StaticData | null>(null);
  useEffect(() => {
    (async () => {
      setStaticData(await window.electron.getStaticData());
    })();
  }, []);

  return staticData;
}

export default App;
