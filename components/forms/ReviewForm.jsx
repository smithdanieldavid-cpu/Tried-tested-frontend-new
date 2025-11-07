'use client';
import React, { useState } from 'react';
import CategorySelector from './CategorySelector.jsx';
import ProductIdentifier from './ProductIdentifier.jsx';
import { fetchDataFromApi } from '../../utils/api';

const ReviewForm = () => {
 
  const [formData, setFormData] = useState({

    selectedCategoryId: null,

    isNewSubmission: false,
    productId: null,
    newProductDetails: {}, review_text: '',

    submissionStatus: 'idle',
    submissionMessage: '',
  }); const handleCategorySelect = (category) => {
    setFormData(prev => ({
      ...prev, selectedCategoryId: category.id, productId: null, newProductDetails: {}, }));
  };

  const handleProductChange = ({ productId, newProductDetails, isNew }) => {
    setFormData(prev => ({
      ...prev,
      isNewSubmission: isNew,
      productId: isNew ? null : productId,
      newProductDetails: isNew ? newProductDetails : {},
    }));
  };  const handleTextChange = (e) => {
    setFormData(prev => ({
      ...prev,
      review_text: e.target.value,
    }));
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData(prev => ({
      ...prev,
      submissionStatus: 'submitting',
      submissionMessage: 'Sending review for AI check...',
    }));    if (!formData.selectedCategoryId || (!formData.productId && !formData.newProductDetails.model_name)) {
      setFormData(prev => ({
        ...prev,
        submissionStatus: 'error',
        submissionMessage: 'Please select a category and identify the product.',
      }));      return;
    }


    const USER_ID = 1;
    const reviewData = { review_text: formData.review_text, user: USER_ID, }; let finalPayload = {};
   if (formData.isNewSubmission) {
      finalPayload = {
        ...reviewData,
        product_submission: {
          ...formData.newProductDetails,
          category: formData.selectedCategoryId,
        },
      };



    } else {

      finalPayload = {
        ...reviewData,
        product: formData.productId,
      };
    }


    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: finalPayload }),
      });

      const result = await response.json();

      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          submissionStatus: 'success',
          submissionMessage: result.message || 'Review submitted successfully!',
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          submissionStatus: 'error',
          submissionMessage: result.error?.message || 'Submission failed. Check your data.',
        }));
      }

    } catch (error) {
      setFormData(prev => ({
        ...prev,
        submissionStatus: 'error',
        submissionMessage: 'Network error or server unavailable.',
      }));
    }
  };



  const isCategorySelected = !!formData.selectedCategoryId;
  const isProductIdentified = formData.productId || formData.newProductDetails.model_name;

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h2>Submit a Review</h2>
      <CategorySelector onSelectCategory={handleCategorySelect} /> {isCategorySelected && (
        <ProductIdentifier
          categoryId={formData.selectedCategoryId}
          onProductChange={handleProductChange}
        />
      )}{isProductIdentified && (
        <div className="review-content-step">
          <h3>3. Write Your Review</h3>
          <textarea
            value={formData.review_text}
            onChange={handleTextChange}
            placeholder="Share your detailed experience with the gear here..."
            rows="8"
            required
          />
        </div>
      )}


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
