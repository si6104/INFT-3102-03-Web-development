const fs = require('fs');
const path = require('path');

module.exports = function() {
  // Read CMS movies from JSON
  const cmsDataPath = path.join(__dirname, 'cmsData.json');
  let cmsMovies = [];
  
  if (fs.existsSync(cmsDataPath)) {
    try {
      const cmsData = JSON.parse(fs.readFileSync(cmsDataPath, 'utf-8'));
      cmsMovies = cmsData.movies || [];
    } catch (error) {
      console.error('Error reading cmsData.json:', error);
    }
  }
  
  return cmsMovies;
};
