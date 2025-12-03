import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function() {
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
}
