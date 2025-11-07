// tried-tested-frontend/utils/api.js

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

/**
 * Fetches data from the Strapi API.
 * @param {string} endpoint The API endpoint (e.g., 'categories').
 * @param {string} queryParams Query parameters (e.g., 'populate=*').
 * @returns {Promise<any>} The response data.
 */
export async function fetchDataFromApi(endpoint, queryParams = '') {
  const url = `${STRAPI_API_URL}/api/${endpoint}?${queryParams}`;
  
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // You would add authorization headers here for private data
    });

    if (!res.ok) {
      throw new Error(`Strapi API Error: ${res.statusText}`);
    }

    const data = await res.json();
    
    // Strapi often wraps the actual data payload in a 'data' property
    return data.data; 

  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    // You can implement custom error handling here (e.g., redirect to an error page)
    return null;
  }
}