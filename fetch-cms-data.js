/* 
  File: fetch-cms-data.js
  Description: Pre-fetches Contentful CMS data and saves to JSON before Eleventy build
  Author: Sai Trivedi
  Date: 2025-11-14
*/

import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

async function fetchContentfulData() {
  const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
  const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;

  console.log("🔍 Checking Contentful credentials...");
  
  if (!SPACE_ID || !ACCESS_TOKEN) {
    console.warn("⚠️  Missing Contentful environment variables!");
    console.warn("   Creating empty cmsData.json file...");
    fs.writeFileSync(
      path.join(__dirname, "_data", "cmsData.json"),
      JSON.stringify({ movies: [] }, null, 2)
    );
    return;
  }

  try {
    console.log("🎬 Fetching movies from Contentful...");
    
    const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?content_type=movie&include=2&access_token=${ACCESS_TOKEN}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Contentful API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract all assets (images)
    const assets = {};
    if (data.includes?.Asset) {
      data.includes.Asset.forEach(asset => {
        const fileUrl = asset.fields.file?.url || asset.fields.file?.file?.url;
        if (fileUrl) {
          assets[asset.sys.id] = `https:${fileUrl}`;
        }
      });
    }
    
    // Convert to movie objects
    const movies = data.items.map(item => {
      const fields = item.fields;
      
      // Poster field is a LIST (Media - many files)
      let posterId = null;
      if (Array.isArray(fields.poster) && fields.poster.length > 0) {
        posterId = fields.poster[0].sys.id; // Take first image
      }
      
      return {
        id: item.sys.id,
        title: fields.title || "Untitled",
        director: fields.director || "Unknown",
        releaseYear: fields.releaseYear || 0,
        genre: fields.genre || "Unknown",
        rating: fields.rating || 0,
        description: fields.description || "",
        poster: posterId ? assets[posterId] : "https://via.placeholder.com/300x450",
        source: "contentful",
        createdAt: item.sys.createdAt,
        updatedAt: item.sys.updatedAt
      };
    });
    
    console.log(`✅ Loaded ${movies.length} movies from Contentful`);
    
    // Save to JSON file
    const outputPath = path.join(__dirname, "_data", "cmsData.json");
    fs.writeFileSync(outputPath, JSON.stringify({ movies }, null, 2));
    
    console.log(`💾 Saved CMS data to ${outputPath}`);
    
  } catch (error) {
    console.error("❌ Error loading Contentful data:", error.message);
    console.warn("   Creating empty cmsData.json file...");
    fs.writeFileSync(
      path.join(__dirname, "_data", "cmsData.json"),
      JSON.stringify({ movies: [] }, null, 2)
    );
  }
}

fetchContentfulData();
