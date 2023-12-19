// SearchBar.js
import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = async () => {
    try {
        const response = await axios.get(`http://localhost:4000/api/medicine/searchMedicine?query=${searchInput}`);
        console.log('API response:', response.data); // Add this line for debugging
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching for medicine:', error);
      }
  };

  return (
    <div className="search-bar">
      <h1>Search for medicine by name</h1>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        {searchResults.map((result) => (
          <div key={result._id}>Name: {result.name}, Medicinal Use: {result.medicinalUse}</div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
