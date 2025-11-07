// tried-tested-frontend/components/forms/CategorySelector.jsx

import React, { useState, useEffect } from 'react';
import { fetchDataFromApi } from '../../../utils/api';

const CategorySelector = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [mainCategory, setMainCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);

  useEffect(() => {
    // We only want basic names and the parent link
    const query = 'populate=parent'; 
    
    fetchDataFromApi('categories', query)
      .then(data => {
        if (data) {
          setCategories(data);
        }
      });
  }, []);

  // --- Rendering Logic (Example) ---
  
  const mainCategories = categories.filter(cat => !cat.attributes.parent.data);
  const subCategories = categories.filter(cat => cat.attributes.parent.data?.id === mainCategory);

  const handleMainSelect = (categoryId) => {
    setMainCategory(categoryId);
    setSubCategory(null); // Reset sub-category on main change
  };

  const handleSubSelect = (categoryObject) => {
    setSubCategory(categoryObject.id);
    // Pass the final selected category ID and its data up to the parent form
    onSelectCategory(categoryObject); 
  };

  if (categories.length === 0) return <div>Loading Categories...</div>;

  return (
    <div className="category-selector-step">
      <h3>1. Select Gear Category</h3>
      
      {/* Main Category Dropdown */}
      <select onChange={(e) => handleMainSelect(parseInt(e.target.value))}>
        <option value="">Select Main Category</option>
        {mainCategories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.attributes.name}</option>
        ))}
      </select>
      
      {/* Sub-Category Dropdown (Visible only after Main is selected) */}
      {mainCategory && (
        <select onChange={(e) => {
            const selectedCat = categories.find(c => c.id === parseInt(e.target.value));
            handleSubSelect(selectedCat);
        }}>
          <option value="">Select Sub-Category</option>
          {subCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.attributes.name}</option>
          ))}
        </select>
      )}
    </div>
  );
};

export default CategorySelector;