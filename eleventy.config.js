/* 
  File: eleventy.config.js
  Description: Eleventy configuration file for MovieLog with Contentful integration.
  Author: Sai Trivedi
  Date: 2025-11-13
*/

import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Eleventy Configuration File
export default function(eleventyConfig) {
  
  // Copy CSS files, images, and JavaScript to output
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("js");
  
  // Watch CSS files and force a build when they change
  eleventyConfig.setWatchJavaScriptDependencies(false);
  eleventyConfig.addWatchTarget("./css/");
  
  // Override the browser sync configuration to watch CSS files
  eleventyConfig.setBrowserSyncConfig({
    files: ['_site/css/**/*.css']
  });
  
  // Add a collection for all movies (merged from CMS JSON and local markdown)
  eleventyConfig.addCollection("allMovies", function(collectionApi) {
    
    // Get CMS movies from pre-fetched JSON file - read directly from file
    let cmsMovies = [];
    try {
      const cmsDataPath = path.join(__dirname, '_data', 'cmsData.json');
      
      if (fs.existsSync(cmsDataPath)) {
        const cmsData = JSON.parse(fs.readFileSync(cmsDataPath, 'utf-8'));
        cmsMovies = cmsData.movies || [];
        
        // DEBUG: Write to file to verify
        const debugInfo = {
          cmsDataPath,
          fileExists: true,
          cmsMoviesCount: cmsMovies.length,
          timestamp: new Date().toISOString()
        };
        fs.writeFileSync(path.join(__dirname, 'collection-debug.json'), JSON.stringify(debugInfo, null, 2));
      } else {
        fs.writeFileSync(path.join(__dirname, 'collection-debug.json'), JSON.stringify({
          cmsDataPath,
          fileExists: false,
          timestamp: new Date().toISOString()
        }, null, 2));
      }
    } catch (error) {
      fs.writeFileSync(path.join(__dirname, 'collection-debug.json'), JSON.stringify({
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }, null, 2));
    }
    
    // Get local markdown movies
    const localMovies = collectionApi.getFilteredByGlob("movies/*.md").map(item => {
      return {
        ...item.data,
        id: item.page.fileSlug,
        source: item.data.source || "local",
        page: item.page,
        url: item.url,
        date: item.date
      };
    });
    
    console.log(`📂 Found ${localMovies.length} local movies`);
    
    // Merge CMS and local movies
    const allMovies = [...cmsMovies, ...localMovies];
    
    console.log(`📊 Total movies: ${allMovies.length}`);
    
    // Sort by releaseYear descending
    return allMovies.sort((a, b) => {
      const yearA = a.releaseYear || a.data?.releaseYear || 0;
      const yearB = b.releaseYear || b.data?.releaseYear || 0;
      return yearB - yearA;
    });
  });
  
  // Keep original movies collection for backward compatibility
  eleventyConfig.addCollection("movies", function(collectionApi) {
    return collectionApi.getFilteredByTag("movies").sort((a, b) => {
      const yearA = a.data.year || a.data.releaseYear || 0;
      const yearB = b.data.year || b.data.releaseYear || 0;
      return yearB - yearA;
    });
  });
  
  // Add a filter to limit number of items
  eleventyConfig.addFilter("limit", function(array, limit) {
    return array.slice(0, limit);
  });
  
  // Add reverse filter
  eleventyConfig.addFilter("reverse", function(array) {
    return array.slice().reverse();
  });
  
  // Eleventy directory & template settings
  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}