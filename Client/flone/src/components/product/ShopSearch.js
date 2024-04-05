import React, { useState } from 'react';

const ShopSearch = ({ onSearch }) => {

  const handleChange = (event) => {
    const value = event.target.value;
    onSearch(value);
  };

  return (
    <div className="sidebar-widget">
      <div className="pro-sidebar-search mb-50 mt-25">
        <div className="pro-sidebar-search-form">
          <input
            type="text"
            placeholder="Search here..."
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ShopSearch;
