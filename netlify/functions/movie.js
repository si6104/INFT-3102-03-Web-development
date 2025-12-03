/**
 * File: movie.js
 * Description: Netlify serverless function to fetch live movie data from OMDB API
 * Author: Sai Trivedi
 * Date: December 2025
 * 
 * This function demonstrates:
 * - Serverless computing architecture
 * - Asynchronous API calls using async/await
 * - Error handling for production environments
 * - Dynamic data fetching for static sites
 */

const fetch = require('node-fetch');

/**
 * Serverless function handler
 * @param {Object} event - Contains HTTP request data including query parameters
 * @param {Object} context - Contains information about the invocation
 * @returns {Promise<Object>} HTTP response with status code and body
 */
exports.handler = async (event, context) => {
  try {
    // Extract movie title from query parameters
    const { title } = event.queryStringParameters || {};
    
    // Validate required parameter
    if (!title) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Missing required parameter: title',
          message: 'Please provide a movie title in the query string'
        })
      };
    }

    // OMDB API configuration
    // Note: In production, use environment variable: process.env.OMDB_API_KEY
    const OMDB_API_KEY = 'daa92efe'; // Replace with your OMDB API key
    const apiUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`;

    // Asynchronous API call using async/await
    console.log(`Fetching movie data for: ${title}`);
    const response = await fetch(apiUrl);
    
    // Check if the HTTP request was successful
    if (!response.ok) {
      throw new Error(`OMDB API returned status ${response.status}`);
    }

    // Parse JSON response asynchronously
    const data = await response.json();

    // Check if movie was found in OMDB database
    if (data.Response === 'False') {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Movie not found',
          message: data.Error || 'No movie found with that title'
        })
      };
    }

    // Extract required fields for the frontend
    const movieData = {
      title: data.Title,
      imdbRating: data.imdbRating || 'N/A',
      runtime: data.Runtime || 'N/A',
      genre: data.Genre || 'N/A',
      actors: data.Actors || 'N/A',
      plot: data.Plot || 'N/A',
      poster: data.Poster !== 'N/A' ? data.Poster : null,
      year: data.Year || 'N/A',
      director: data.Director || 'N/A'
    };

    console.log(`Successfully fetched data for: ${movieData.title}`);

    // Return successful response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      },
      body: JSON.stringify(movieData)
    };

  } catch (error) {
    // Handle any errors during the process
    console.error('Error in movie serverless function:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: 'Failed to fetch movie data. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};
