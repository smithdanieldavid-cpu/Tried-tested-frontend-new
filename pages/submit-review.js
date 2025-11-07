'use client'; // 🔹 Must be first line because ReviewForm uses hooks

import ReviewForm from '../components/forms/ReviewForm.jsx';
import Head from 'next/head';

const SubmitReviewPage = () => {
  return (
    <>
      {/* Standard Next.js Head component for SEO/Page Title */}
      <Head>
        <title>Submit Gear Review | Tried-Tested</title>
      </Head>

      <main className="container">
        {/* Optional: Add a welcoming header */}
        <h1 className="page-title">Share Your Experience</h1>
        <p>Help others by submitting a detailed review of your gear.</p>

        {/* Render the ReviewForm component */}
        <ReviewForm />
      </main>
    </>
  );
};

export default SubmitReviewPage;
