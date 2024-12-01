import React, { useState } from "react";
import Map from "./components/map/Map";
import CustomSettingsPanel from "./components/map/CustomSettingsPanel";
import "./App.css";

const App = () => {
  const [selectedMode, setSelectedMode] = useState('일반');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
  };

  return (
    <div className="App">
      <Map 
        selectedMode={selectedMode}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />
      {!isSearchOpen && (
        <CustomSettingsPanel 
          onModeChange={handleModeChange}
          selectedMode={selectedMode}
        />
      )}
    </div>
  );
};

export default App;