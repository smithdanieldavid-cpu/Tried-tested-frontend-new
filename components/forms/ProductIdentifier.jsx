'use client';
import React, { useState, useEffect } from 'react';
import { fetchDataFromApi } from '../../utils/api';

const ProductIdentifier = ({ categoryId, onProductChange }) => {
  const [mode, setMode] = useState('existing'); // 'existing' or 'new'
  const [products, setProducts] = useState([]);
  const [newProductDetails, setNewProductDetails] = useState({});

  // 🔹 Fetch products when category changes
  useEffect(() => {
    if (!categoryId) return;

    const query = `filters[category][id][$eq]=${categoryId}&populate=brand`;

    fetchDataFromApi('products', query)
      .then((data) => {
        if (data) setProducts(data);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
      });
  }, [categoryId]);

  // 🔹 Handle existing product selection
  const handleExistingSelect = (id) => {
    onProductChange({
      productId: id,
      isNew: false,
    });
  };

  // 🔹 Handle new product input
  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    const updatedDetails = { ...newProductDetails, [name]: value };
    setNewProductDetails(updatedDetails);

    onProductChange({
      newProductDetails: updatedDetails,
      isNew: true,
    });
  };

  // 🔹 UI
  return (
    <div className="product-identifier-step">
      <h3>2. Identify the Gear</h3>

      {/* Mode toggle */}
      <div className="mode-toggle">
        <button
          type="button"
          onClick={() => setMode('existing')}
          className={mode === 'existing' ? 'active' : ''}
        >
          Review Existing Gear
        </button>
        <button
          type="button"
          onClick={() => setMode('new')}
          className={mode === 'new' ? 'active' : ''}
        >
          Review New Gear
        </button>
      </div>

      {/* --- Existing Product Mode --- */}
      {mode === 'existing' && products.length > 0 && (
        <div>
          <label>Select Your Gear:</label>
          <select onChange={(e) => handleExistingSelect(parseInt(e.target.value))}>
            <option value="">Select a specific model...</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.attributes.brand.data?.attributes.name} – {product.attributes.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* --- New Product Submission --- */}
      {mode === 'new' && (
        <div>
          <label>Brand Name (e.g., Arc'teryx)</label>
          <input
            type="text"
            name="brand_name_text"
            onChange={handleNewInputChange}
            placeholder="Enter brand name"
          />

          <label>Model Name (e.g., Zeta SL Jacket)</label>
          <input
            type="text"
            name="model_name"
            onChange={handleNewInputChange}
            placeholder="Enter model name"
          />
        </div>
      )}
    </div>
  );
};

export default ProductIdentifier;
