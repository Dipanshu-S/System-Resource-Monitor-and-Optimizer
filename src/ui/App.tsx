import { useEffect, useMemo, useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { useStatistics } from './useStatistics';
import { Chart } from './Chart';

function App() {
  const [count, setCount] = useState(0);
  const [staticData, setStaticData] = useState<any>(null); // define staticData state
  const statistics = useStatistics(10);
  const cpuUsages = useMemo(
    () => statistics.map((stat) => stat.cpuUsage),
    [statistics]
  );

  console.log(statistics);

  // Define the missing function to fetch or set static data
  const handleGetStaticData = async () => {
    // For demonstration, we'll simulate fetching data with a timeout.
    const data = await new Promise((resolve) =>
      setTimeout(() => resolve({ message: 'Hello, world!', timestamp: Date.now() }), 500)
    );
    setStaticData(data);
  };

  return (
      <div className='App'>
       <div style={{height:120 }}>
        <Chart data = {cpuUsages} maxDataPoints={10}/>
       </div>
       <div> 
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src="icon.png" className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>UNIFIED OBSERVABILITY</h1>
      <div className="card">
        {/* Now calling the defined function */}
        <button onClick={handleGetStaticData}>
          Get Static Data
        </button>
        {/* Display the result on the page (formatted as JSON) */}
        {staticData && (
          <pre>{JSON.stringify(staticData, null, 2)}</pre>
        )}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
