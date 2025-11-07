// tried-tested-frontend/pages/index.js

import Head from 'next/head';

const HomePage = () => {
    return (
        <>
            <Head>
                <title>Tried-Tested Gear Reviews</title>
            </Head>
            <main className="container">
                <h1>Welcome to Tried-Tested</h1>
                <p>Use the navigation to submit a review or browse our gear listings!</p>
                
                {/* Add a link to your submit-review page */}
                {/* Note: If you have a global layout component, use it here */}
                <p><a href="/submit-review">Go to Submit Review Page</a></p>
            </main>
        </>
    );
};

export default HomePage;