// tried-tested-frontend/pages/submit-review.js

import ReviewForm from '../Components/Forms/ReviewForm.jsx';
import Head from 'next/head';

// This is the component that Next.js automatically renders as a page
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
                
                {/* RENDER THE COMPONENT HERE */}
                <ReviewForm /> 
            </main>
        </>
    );
};

export default SubmitReviewPage;