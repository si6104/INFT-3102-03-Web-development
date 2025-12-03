# Part 2 - Serverless Function Integration - Quick Reference

## 📋 What Was Created

### 1. Serverless Function
**File:** `/netlify/functions/movie.js`
- Fetches live movie data from OMDB API
- Uses async/await for asynchronous operations
- Returns JSON with IMDb rating, runtime, genre, actors, plot
- Handles errors gracefully with proper HTTP status codes

### 2. Client-Side Script
**File:** `/js/live.js`
- Loads dynamic content after page loads
- Implements state management with caching
- Uses async/await for API calls
- Updates DOM elements with live data

### 3. Template Updates
**File:** `_includes/layouts/movie.njk`
- Added Live OMDB Data section
- Includes placeholder elements (live-rating, live-runtime, etc.)
- Added data-movie-title attribute for script
- Includes live.js script tag

### 4. Configuration Files
- **netlify.toml**: Netlify deployment configuration
- **package.json**: Added node-fetch dependency
- **eleventy.config.js**: Added js folder passthrough

### 5. Documentation
- **README.md**: Comprehensive Part 2 documentation section

---

## 🚀 Local Testing (Without Netlify)

Since we're running Eleventy locally (not Netlify Dev), the serverless function won't work yet. You have two options:

### Option A: Test with Netlify Dev (Recommended)

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Start Netlify Dev:**
```bash
cd "e:\My DC\sem - 5\INFT-3102 Web Dev framework\movielog_1\movielog"
netlify dev
```

3. **Access site at:** http://localhost:8888

4. **Test function directly:**
```
http://localhost:8888/.netlify/functions/movie?title=Inception
```

### Option B: Mock Data for Local Testing

If you don't want to install Netlify CLI, you can temporarily modify `live.js` to use mock data:

```javascript
// Add this at the top of loadLiveMovieData()
// TEMPORARY: Mock data for local testing
const mockData = {
  imdbRating: '8.8',
  runtime: '148 min',
  genre: 'Action, Sci-Fi, Thriller',
  actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
  plot: 'A thief who steals corporate secrets through dream-sharing technology...'
};
updateUI(mockData);
return;
```

---

## 🧪 Testing Checklist

### Static Content (Should Work Now)
- [ ] Homepage shows movies
- [ ] All movies page displays correctly
- [ ] Movie detail pages load
- [ ] Filtering works on all-movies page

### Dynamic Content (Requires Netlify Dev)
- [ ] "Live OMDB Data" section appears on movie pages
- [ ] "Loading..." text appears initially
- [ ] Data populates from OMDB API
- [ ] Console shows state management logs
- [ ] Revisiting same movie uses cached data

### Console Logs to Verify
```
🚀 Live movie data script initialized
📄 Movie detail page detected - loading live data
🎬 Loading live data for: [Movie Title]
🌐 Fetching from: /.netlify/functions/movie?title=...
✅ Successfully fetched live movie data
✅ Saved "[Movie Title]" to state cache
✅ UI updated successfully
```

---

## 📦 Deployment to Netlify

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Part 2: Serverless function integration"
git push
```

### Step 2: Connect to Netlify
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository

### Step 3: Configure Build Settings
- **Build command:** `npm run build`
- **Publish directory:** `_site`
- **Functions directory:** Auto-detected from netlify.toml

### Step 4: Add Environment Variables
Go to Site Settings → Environment Variables:
- **Key:** `OMDB_API_KEY`
- **Value:** `daa92efe` (or your API key)

### Step 5: Deploy
Click "Deploy site" - Netlify will:
1. Install dependencies
2. Run build command
3. Deploy functions automatically
4. Serve site with serverless functions

---

## 🎯 Assignment Requirements Coverage

### ✅ Serverless Functions
- **Location:** `/netlify/functions/movie.js`
- **Implementation:** Exports `handler` function
- **Features:** Query parameters, error handling, JSON responses

### ✅ Asynchronous Programming
- **Serverless:** `async handler`, `await fetch`, `await response.json()`
- **Frontend:** `async loadLiveMovieData()`, `await fetch`, `await response.json()`
- **Benefits:** Non-blocking, readable, proper error handling

### ✅ Dynamic Content
- **Elements Updated:** live-rating, live-runtime, live-genre, live-actors, live-plot
- **Data Source:** OMDB API via serverless function
- **Loading States:** "Loading..." → Data → "N/A" on error

### ✅ State Management
- **Global State:** `let liveMovieState = {}`
- **Caching:** Saves fetched data by movie title
- **Reuse:** Checks cache before fetching
- **Logging:** "Using cached state" message

---

## 🐛 Troubleshooting

### Serverless Function Not Working Locally?
→ Use `netlify dev` instead of `npm start`

### "Loading..." Never Changes?
→ Check browser console for errors
→ Verify movie title in data-movie-title attribute

### OMDB Returns "Movie not found"?
→ Some movie titles need exact spelling
→ Try "The Matrix" instead of "Matrix"

### Cached Data Not Clearing?
→ Run `window.refreshMovieData()` in console
→ Or close/reopen browser tab

---

## 📚 Key Concepts Explained

### Serverless vs Traditional Server
| Traditional Server | Serverless Function |
|-------------------|---------------------|
| Always running | Runs on-demand |
| Fixed cost | Pay per execution |
| Manage infrastructure | Managed by platform |
| Scalability planning | Auto-scales |

### Async/Await Flow
```javascript
// Without await (promise chain)
fetch(url)
  .then(res => res.json())
  .then(data => updateUI(data))
  .catch(err => handleError(err));

// With await (cleaner)
try {
  const res = await fetch(url);
  const data = await res.json();
  updateUI(data);
} catch (err) {
  handleError(err);
}
```

### State Management Purpose
```javascript
// First visit: Makes API call
loadLiveMovieData('Inception') // → Fetches from OMDB

// Second visit: Uses cache
loadLiveMovieData('Inception') // → Returns cached data
```

---

## 📝 Submission Checklist

- [ ] All files created and in correct locations
- [ ] README documentation section added
- [ ] Code comments explain key concepts
- [ ] Tested locally with Netlify Dev
- [ ] Deployed to Netlify
- [ ] Screenshots showing dynamic content loading
- [ ] Console logs demonstrate state management

---

## 🎓 Academic Value

This implementation demonstrates:
- **Cloud Computing:** Serverless architecture
- **Modern JavaScript:** ES6+, async/await, modules
- **API Integration:** Third-party service consumption
- **State Management:** Browser-based caching
- **Progressive Enhancement:** Static + dynamic content
- **Error Handling:** Graceful degradation
- **Performance Optimization:** Caching strategies

---

## 📧 Questions?

If you encounter issues:
1. Check browser console for errors
2. Verify all files exist in correct locations
3. Ensure node-fetch is installed
4. Test with Netlify Dev for full functionality
5. Review README documentation section

---

**Created:** December 2025  
**Part 2 Requirement:** Serverless Functions + Dynamic Content + State Management
