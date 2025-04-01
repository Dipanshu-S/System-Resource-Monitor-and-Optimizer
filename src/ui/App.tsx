import { useEffect, useMemo, useState } from 'react';  
import Icon from './assets/icon.png'; 
import './App.css';
import { useStatistics } from './useStatistics';
import { Chart } from './Chart';
import { StaticData, View } from '../../types';
import { BaseChart } from './BaseChart';
import { DynamicTable } from './DynamicTable';

function App() {
  const staticData = useStaticData();
  const batteryData = useBatteryData();
  const [count, setCount] = useState(0);
  const [setStaticData] = useState<any>(null); // define staticData state
  const statistics = useStatistics(10);
  const [activeView, setActiveView] = useState<View>('CPU');
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


  console.log(statistics);

  return (
    <div className="App">
    <Header />
    <div className="title">
      <center><h3>ApexSys : The Unified System Management</h3></center>
    </div>
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
          subTitle={(staticData?.totalMemoryGB.toString() ?? '') + ' GB'}
          data={ramUsages}
        />
        <SelectOption 
          title="STORAGE"
          onClick={() => setActiveView('STORAGE')}
          view="STORAGE"
          subTitle={(staticData?.totalStorage.toString() ?? '') + ' GB'}
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
    {/* New Active Applications Section */}
    <div className="dynamicTableSection">
      <h2 style={{ textAlign: "center", color: "#00A0CC", margin: "1rem 0" }}>Active Applications</h2>
      <DynamicTable />
    </div>
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
            {batteryData.isCharging ? "Charging" : "Not Plugged In"}
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
