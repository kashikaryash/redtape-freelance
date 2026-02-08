// Layout.js
import React, { useState } from 'react';
import CategoryNavbar from './CategoryNavbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const [selectedCategory, setSelectedCategory] = useState('MEN'); // default to MEN

  return (
    <>
      <CategoryNavbar onCategorySelect={setSelectedCategory} />
      <div className="d-flex">
        <Sidebar selectedCategory={selectedCategory} />
        <div className="flex-grow-1 p-3">
          {/* Main content goes here */}
          <h2>Products for {selectedCategory}</h2>
        </div>
      </div>
    </>
  );
};

export default Layout;
