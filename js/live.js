/**
 * File: live.js
 * Description: Client-side JavaScript for loading dynamic movie data from serverless function
 * Author: Sai Trivedi
 * Date: December 2025
 * 
 * This script demonstrates:
 * - Asynchronous programming with async/await
 * - Dynamic content loading in static sites
 * - State management in the browser
 * - DOM manipulation
 * - Error handling for network requests
 */

// ============================================
// STATE MANAGEMENT
// ============================================

/**
 * Global state object to cache movie data
 * Prevents redundant API calls for the same movie
 * Key: movie title, Value: movie data object
 */
let liveMovieState = {};

/**
 * Save movie data to state
 * @param {string} title - Movie title (used as key)
 * @param {Object} data - Movie data to cache
 */
function saveToState(title, data) {
  liveMovieState[title] = {
    data: data,
    timestamp: Date.now(),
    cached: true
  };
  console.log(`✅ Saved "${title}" to state cache`);
}

/**
 * Retrieve movie data from state
 * @param {string} title - Movie title to look up
 * @returns {Object|null} Cached movie data or null if not found
 */
function getFromState(title) {
  if (liveMovieState[title]) {
    console.log(`♻️ Using cached state for "${title}"`);
    return liveMovieState[title].data;
  }
  return null;
}

// ============================================
// DYNAMIC CONTENT LOADING
// ============================================

/**
 * Main function to load live movie data from serverless function
 * Uses async/await for clean asynchronous code
 */
async function loadLiveMovieData() {
  try {
    // Get movie title from data attribute on the page
    const movieElement = document.querySelector('[data-movie-title]');
    
    if (!movieElement) {
      console.warn('⚠️ No element with data-movie-title attribute found');
      return;
    }

    const movieTitle = movieElement.getAttribute('data-movie-title');
    
    if (!movieTitle) {
      console.warn('⚠️ Movie title is empty');
      updateUIWithError('Movie title not specified');
      return;
    }

    console.log(`🎬 Loading live data for: ${movieTitle}`);

    // ============================================
    // STATE MANAGEMENT CHECK
    // ============================================
    // Check if data already exists in state
    const cachedData = getFromState(movieTitle);
    
    if (cachedData) {
      // Reuse cached data instead of making another API call
      console.log('📦 Using cached data from state');
      updateUI(cachedData);
      return; // Early return - no need to fetch
    }

    // ============================================
    // ASYNCHRONOUS API CALL
    // ============================================
    // Show loading state
    updateUILoading();

    // Construct serverless function URL
    const functionUrl = `/.netlify/functions/movie?title=${encodeURIComponent(movieTitle)}`;
    
    console.log(`🌐 Fetching from: ${functionUrl}`);

    // Asynchronous fetch using async/await
    const response = await fetch(functionUrl);

    // Check if the request was successful
    if (!response.ok) {
      // Check if response is HTML (404 page) instead of JSON
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('text/html')) {
        // Serverless function not available (likely running locally)
        throw new Error('Serverless function not available. Deploy to Netlify to see live data.');
      }
      
      // Try to parse error as JSON
      try {
        const errorData = await response.json();
        console.error('Error response from function:', errorData);
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
      } catch (e) {
        if (e.message.includes('Serverless function')) throw e;
        console.error('Could not parse error response:', e);
        throw new Error(`Failed to load data (HTTP ${response.status})`);
      }
    }

    // Parse JSON response asynchronously
    const movieData = await response.json();
    
    console.log('✅ Successfully fetched live movie data:', movieData);

    // ============================================
    // STATE MANAGEMENT - SAVE
    // ============================================
    // Save to state for future use
    saveToState(movieTitle, movieData);

    // Update the user interface with fetched data
    updateUI(movieData);

  } catch (error) {
    // Handle any errors during the fetch process
    console.error('❌ Error loading live movie data:', error);
    updateUIWithError(error.message);
  }
}

// ============================================
// DOM MANIPULATION FUNCTIONS
// ============================================

/**
 * Update UI elements with loading state
 */
function updateUILoading() {
  const elements = {
    'live-rating': '⏳ Loading...',
    'live-runtime': '⏳ Loading...',
    'live-genre': '⏳ Loading...',
    'live-actors': '⏳ Loading...',
    'live-plot': '⏳ Loading...'
  };

  Object.keys(elements).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = elements[id];
      element.style.fontStyle = 'italic';
      element.style.color = '#666';
    }
  });
}

/**
 * Update UI elements with fetched movie data
 * @param {Object} data - Movie data from serverless function
 */
function updateUI(data) {
  // Map data to DOM elements
  const updates = {
    'live-rating': data.imdbRating !== 'N/A' ? `⭐ ${data.imdbRating}/10` : 'N/A',
    'live-runtime': data.runtime,
    'live-genre': data.genre,
    'live-actors': data.actors,
    'live-plot': data.plot
  };

  // Update each element
  Object.keys(updates).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = updates[id];
      element.style.fontStyle = 'normal';
      element.style.color = 'inherit';
      
      // Add fade-in animation
      element.style.opacity = '0';
      setTimeout(() => {
        element.style.transition = 'opacity 0.5s ease-in';
        element.style.opacity = '1';
      }, 100);
    }
  });

  console.log('✅ UI updated successfully');
}

/**
 * Update UI elements with error state
 * @param {string} errorMessage - Error message to display
 */
function updateUIWithError(errorMessage) {
  const elements = ['live-rating', 'live-runtime', 'live-genre', 'live-actors', 'live-plot'];
  
  elements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = 'N/A';
      element.style.fontStyle = 'italic';
      element.style.color = '#999';
    }
  });

  // Display error message if plot element exists
  const plotElement = document.getElementById('live-plot');
  if (plotElement) {
    // Check if it's a movie not found error
    if (errorMessage.includes('not found') || errorMessage.includes('404')) {
      plotElement.textContent = 'This movie is not available in OMDB database (primarily Hollywood movies). Try viewing a Hollywood movie like "Inception" or "The Matrix" to see live data.';
    } else if (errorMessage.includes('not available')) {
      plotElement.textContent = 'Live data available only on Netlify deployment. This movie may also not be in OMDB database.';
    } else {
      plotElement.textContent = `Unable to load live data: ${errorMessage}`;
    }
    plotElement.style.color = '#d32f2f';
  }

  console.error('UI updated with error state');
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the dynamic content loading when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Live movie data script initialized');
  
  // Check if we're on a movie detail page
  const isMoviePage = document.querySelector('[data-movie-title]') !== null;
  
  if (isMoviePage) {
    console.log('📄 Movie detail page detected - loading live data');
    loadLiveMovieData();
  } else {
    console.log('📄 Not a movie detail page - skipping live data load');
  }
});

/**
 * Optional: Expose function globally for manual refresh
 * Usage: window.refreshMovieData()
 */
window.refreshMovieData = () => {
  console.log('🔄 Manual refresh triggered');
  // Clear cached state for current movie
  const movieElement = document.querySelector('[data-movie-title]');
  if (movieElement) {
    const title = movieElement.getAttribute('data-movie-title');
    delete liveMovieState[title];
    console.log(`🗑️ Cleared cache for "${title}"`);
  }
  loadLiveMovieData();
};

// Log current state (for debugging)
console.log('📊 Current state:', liveMovieState);
