// tried-tested-frontend/components/forms/ReviewForm.jsx

import React, { useState } from 'react';
import CategorySelector from './CategorySelector'; // Step 1
import ProductIdentifier from './ProductIdentifier'; // Step 2
import DynamicRater from './DynamicRater'; // Step 3
import { fetchDataFromApi } from '../../utils/api';

const ReviewForm = () => {
  // Master state to manage all parts of the submission
  const [formData, setFormData] = useState({
    // 1. Category Data
    selectedCategoryId: null, // Sub-category ID (for metrics and product links)
    
    // 2. Product Identification Data
    isNewSubmission: false, 
    productId: null,        
    newProductDetails: {},  // { model_name, brand_name_text }
    
    // 3. Rating Data
    ratings: {}, 
    
    // 4. Content Data
    review_text: '',
    // photo_ids: [], 
    
    // UX/Status
    submissionStatus: 'idle', // 'submitting', 'success', 'error'
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

  const handleRatingsChange = (newRatings) => {
    setFormData(prev => ({
      ...prev,
      ratings: newRatings,
    }));
  };

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

    // Basic Validation Check (Can be more thorough)
    if (!formData.selectedCategoryId || (!formData.productId && !formData.newProductDetails.model_name)) {
      setFormData(prev => ({ ...prev, submissionStatus: 'error', submissionMessage: 'Please select a category and identify the product.' }));
      return;
    }
    
    // NOTE: Replace '1' with actual authenticated User ID
    const USER_ID = 1;

    // 1. Assemble the core Review Data
    const reviewData = {
      review_text: formData.review_text,
      ratings: JSON.stringify(formData.ratings), // Must be stringified JSON for the Strapi field
      user: USER_ID,
    };
    
    // 2. Determine and Prepare Final Payload (This determines which relation is used)
    let finalPayload = {};

    if (formData.isNewSubmission) {
      // PATH B: New Product Submission (Links Review to ProductSubmission)
      const productSubmissionData = {
        ...formData.newProductDetails, // model_name, brand_name_text
        category: formData.selectedCategoryId, 
      };
      
      finalPayload = {
        ...reviewData,
        // The custom backend controller will intercept this and create the ProductSubmission entry
        product_submission: productSubmissionData,
      };

    } else {
      // PATH A: Existing Product Review (Links Review to Product)
      finalPayload = {
        ...reviewData,
        product: formData.productId, 
      };
    }
    
    // --- 3. Final API Call ---
    try {
      // We are POSTing to the Strapi Review endpoint, which triggers the AI moderation in the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: finalPayload }), // Required Strapi data wrapper
      });

      const result = await response.json();
      
      if (response.ok) {
        // Uses the custom success/flagged message from your Strapi controller
        setFormData(prev => ({ 
            ...prev, 
            submissionStatus: 'success', 
            submissionMessage: result.message 
        }));
      } else {
        // Handle validation errors or failed requests
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

      {/* Step 3: Dynamic Ratings (Requires Product Identification) */}
      {isProductIdentified && (
        <DynamicRater 
          categoryId={formData.selectedCategoryId} 
          onRatingsChange={handleRatingsChange} 
        />
      )}

      {/* Step 4: Review Text Input */}
      {isProductIdentified && (
        <div className="review-content-step">
          <h3>4. Write Your Review</h3>
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