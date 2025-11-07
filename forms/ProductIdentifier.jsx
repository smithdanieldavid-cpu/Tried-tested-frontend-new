// Inside ProductIdentifier.jsx

useEffect(() => {
    if (!categoryId) return;
    
    // Query Strapi: Fetch products where the category ID matches the selected category ID
    // Populating the brand is necessary for a nice display (e.g., "Osprey Atmos AG 65")
    const query = `filters[category][id][$eq]=${categoryId}&populate=brand`; 
    
    fetchDataFromApi('products', query)
      .then(data => {
        // Data will be an array of products belonging to that category
        if (data) {
          setProducts(data);
        }
      });
  }, [categoryId]);

  // Inside the return statement of ProductIdentifier.jsx

return (
    <div className="product-identifier-step">
      <h3>2. Identify the Gear</h3>
  
      {/* Toggle Switch: Choose Submission Mode */}
      <div className="mode-toggle">
          <button onClick={() => setMode('existing')}>Review Existing Gear</button>
          <button onClick={() => setMode('new')}>Review New Gear</button>
      </div>
  
      {/* --- PATH A: EXISTING PRODUCT --- */}
      {mode === 'existing' && products.length > 0 && (
        <div>
          <label>Select Your Gear:</label>
          <select onChange={(e) => handleExistingSelect(parseInt(e.target.value))}>
            <option value="">Select a specific model...</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.attributes.brand.data?.attributes.name} - {product.attributes.name}
              </option>
            ))}
          </select>
        </div>
      )}
  
      {/* --- PATH B: NEW PRODUCT IDEA --- */}
      {mode === 'new' && (
        <div>
          <label>Brand Name (e.g., Arc'teryx)</label>
          <input 
            type="text" 
            name="brand_name_text"
            onChange={handleNewInputChange}
          />
          
          <label>Model Name (e.g., Zeta SL Jacket)</label>
          <input 
            type="text" 
            name="model_name"
            onChange={handleNewInputChange}
          />
        </div>
      )}
    </div>
  );

// Inside ProductIdentifier.jsx

const handleExistingSelect = (id) => {
    // Notify parent that an existing product was selected
    onProductChange({ 
        productId: id, 
        isNew: false 
    });
};

const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    const details = { ...newProductDetails, [name]: value };
    setNewProductDetails(details);
    
    // Notify parent that a new product idea is being submitted
    onProductChange({ 
        newProductDetails: details, 
        isNew: true 
    });
};