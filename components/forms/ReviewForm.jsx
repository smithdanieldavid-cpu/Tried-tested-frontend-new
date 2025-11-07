// tried-tested-frontend/components/forms/ReviewForm.jsx

import React, { useState } from 'react';
import CategorySelector from './CategorySelector.jsx'; // Step 1
import ProductIdentifier from './ProductIdentifier.jsx'; // Step 2
import { fetchDataFromApi } from '../../utils/api';

const ReviewForm = () => {
  // Master state to manage all parts of the submission
  const [formData, setFormData] = useState({
    // 1. Category Data
    selectedCategoryId: null, 
    
    // 2. Product Identification Data
    isNewSubmission: false, 
    productId: null,        
    newProductDetails: {}, 
    
    // 3. Rating Data (Removed, since DynamicRater is missing)
    // ratings: {}, 
    
    // 4. Content Data
    review_text: '',
    
    // UX/Status
    submissionStatus: 'idle', 
    submissionMessage: '',
  });

  // --- Helper Callbacks to Update State from Child Components ---

  const handleCategorySelect = (category) => {
    setFormData(prev => ({
      ...prev,
      selectedCategoryId: category.id,
      // Reset product info if category changes
      productId: null,
      newProductDetails: {},
    }));
  };

  const handleProductChange = ({ productId, newProductDetails, isNew }) => {
    setFormData(prev => ({
      ...prev,
      isNewSubmission: isNew,
      productId: isNew ? null : productId,
      newProductDetails: isNew ? newProductDetails : {},
    }));
  };

  // NOTE: handleRatingsChange is removed since DynamicRater is missing
  /*
  const handleRatingsChange = (newRatings) => {
    setFormData(prev => ({
      ...prev,
      ratings: newRatings,
    }));
  };
  */

  const handleTextChange = (e) => {
    setFormData(prev => ({
      ...prev,
      review_text: e.target.value,
    }));
  };
  
  // --- Main Submission Logic ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData(prev => ({ ...prev, submissionStatus: 'submitting', submissionMessage: 'Sending review for AI check...' }));

    // Basic Validation Check
    if (!formData.selectedCategoryId || (!formData.productId && !formData.newProductDetails.model_name)) {
      setFormData(prev => ({ ...prev, submissionStatus: 'error', submissionMessage: 'Please select a category and identify the product.' }));
      return;
    }
    
    // NOTE: Replace '1' with actual authenticated User ID
    const USER_ID = 1;

    // 1. Assemble the core Review Data (ratings removed as they aren't collected)
    const reviewData = {
      review_text: formData.review_text,
      // ratings: JSON.stringify(formData.ratings), 
      user: USER_ID,
    };
    
    // 2. Determine and Prepare Final Payload 
    let finalPayload = {};

    if (formData.isNewSubmission) {
      // PATH B: New Product Submission 
      const productSubmissionData = {
        ...formData.newProductDetails, // model_name, brand_name_text
        category: formData.selectedCategoryId, 
      };
      
      finalPayload = {
        ...reviewData,
        product_submission: productSubmissionData,
      };

    } else {
      // PATH A: Existing Product Review 
      finalPayload = {
        ...reviewData,
        product: formData.productId, 
      };
    }
    
    // --- 3. Final API Call ---
    try {
      // Note: fetchDataFromApi is not used here, standard fetch is fine.
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: finalPayload }), // Required Strapi data wrapper
      });

      const result = await response.json();
      
      if (response.ok) {
        setFormData(prev => ({ 
            ...prev, 
            submissionStatus: 'success', 
            submissionMessage: result.message 
        }));
      } else {
        setFormData(prev => ({ 
            ...prev, 
            submissionStatus: 'error', 
            submissionMessage: result.error?.message || 'Submission failed. Check your data.' 
        }));
      }

    } catch (error) {
      setFormData(prev => ({ ...prev, submissionStatus: 'error', submissionMessage: 'Network error or server unavailable.' }));
    }
  };

  // --- Rendering the Form ---
  
  const isCategorySelected = !!formData.selectedCategoryId;
  const isProductIdentified = formData.productId || formData.newProductDetails.model_name;

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h2>Submit a Review</h2>

      {/* Step 1: Category Selection */}
      <CategorySelector onSelectCategory={handleCategorySelect} />

      {/* Step 2: Product Identification (Requires Category to be selected) */}
      {isCategorySelected && (
        <ProductIdentifier 
          categoryId={formData.selectedCategoryId} 
          onProductChange={handleProductChange} 
        />
      )}

      {/* Step 3: Dynamic Ratings (REMOVED) */}
      {/* {isProductIdentified && (
        <DynamicRater 
          categoryId={formData.selectedCategoryId} 
          onRatingsChange={handleRatingsChange} 
        />
      )}
      */}

      {/* Step 4: Review Text Input */}
      {isProductIdentified && (
        <div className="review-content-step">
          <h3>3. Write Your Review</h3> {/* Step number changed */}
          <textarea
            value={formData.review_text}
            onChange={handleTextChange}
            placeholder="Share your detailed experience with the gear here..."
            rows="8"
            required
          />
        </div>
      )}

      {/* Final Submission Button and Status */}
      {isProductIdentified && (
        <>
          <button type="submit" disabled={formData.submissionStatus === 'submitting'}>
            {formData.submissionStatus === 'submitting' ? 'Submitting...' : 'Submit Review'}
          </button>
          
          {formData.submissionStatus !== 'idle' && (
            <p className={`status-message status-${formData.submissionStatus}`}>
              {formData.submissionMessage}
            </p>
          )}
        </>
      )}
    </form>
  );
};

export default ReviewForm;