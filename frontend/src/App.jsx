import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { init } from "./utils/fhevm";
import { Connect } from "./Connect";
import ConfidentialDID from "./ConfidentialDID";
import DeFiEligibility from "./DefiEligibilty";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    init()
      .then(() => {
        setIsInitialized(true);
      })
      .catch(() => setIsInitialized(false));
  }, []);

  if (!isInitialized) return null;

  return (
    <Router>
      <div className="App flex flex-col justify-center font-press-start text-black">
        <nav className="flex justify-around p-4 bg-gray-200">
          <Link to="/">Confidential DID</Link>
          <Link to="/defi-eligibility">DeFi Eligibility</Link>
        </nav>
        <Routes>
          <Route 
            path="/" 
            element={
              <Connect>
                {() => <ConfidentialDID />}
              </Connect>
            } 
          />
          <Route 
            path="/defi-eligibility" 
            element={
              <Connect>
                {() => <DeFiEligibility />}
              </Connect>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
