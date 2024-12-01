import React from 'react';
import './SearchResultScreen.css';

const SearchResultScreen = ({ place, onBack, onSelect }) => {
  return (
    <div className="search-result-screen">
      <div className="result-header">
        <button className="back-button" onClick={onBack}>
          ←
        </button>
        <div className="search-input-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={place.name}
            readOnly
          />
        </div>
      </div>
      
      <div className="place-details">
        <h2 className="place-name">{place.name}</h2>
        <p className="place-address">{place.address}</p>
      </div>

      <div className="navigation-button-container">
        <button className="navigation-button" onClick={() => onSelect(place)}>
          <span className="navigation-icon">↗️</span>
          길안내
        </button>
      </div>
    </div>
  );
};

export default SearchResultScreen; 