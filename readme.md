# MovieLog - Dynamic Serverless Movie Application

A movie collection website built with Eleventy, Contentful CMS, and Netlify Serverless Functions, demonstrating serverless computing, asynchronous programming, dynamic content loading, and state management.

**🚀 Live Demo**: [https://693102ce20186a58fba0b553--movvieverse.netlify.app/](https://693102ce20186a58fba0b553--movvieverse.netlify.app/)

## Quick Start

```bash
npm install
npm start
```

Visit: http://localhost:8080

**Environment Variables** (`.env`):
```bash
CONTENTFUL_SPACE_ID=06ixxn1eb58x
CONTENTFUL_ACCESS_TOKEN=gN5Qqm_mgdx1cQoMv3F6vrkDyYlV-lx4aB1haZ54mq0
OMDB_API_KEY=3267c31a
```

## Features

### 1. Serverless Functions (`netlify/functions/movie.js`)
- Fetches real-time movie data from OMDB API
- Async/await for non-blocking API calls
- Error handling with HTTP status codes (200, 400, 404, 500)
- Secure API key management via environment variables

### 2. Asynchronous Programming
- Modern async/await patterns in backend and frontend
- Promise-based fetch operations
- Try-catch error handling

### 3. Dynamic Content Loading (`js/live.js`)
- Updates page with live OMDB data after static content loads
- Progressive enhancement (works without JavaScript)
- Loading states and error messages

### 4. State Management
- `liveMovieState` object caches fetched data
- Prevents redundant API calls
- Instant data display for revisited movies

## How It Works

1. **Static content** loads instantly (Eleventy SSG)
2. **JavaScript** fetches live OMDB data via serverless function
3. **State cache** prevents redundant API calls
4. **DOM updates** dynamically with IMDb ratings, runtime, actors, plot

Visit any Hollywood movie page to see live data in action.

## Scripts

```bash
npm start          # Development server
npm run build      # Production build
netlify dev        # Test serverless functions locally
```

## Deployment (Netlify)

1. Connect GitHub repository to Netlify
2. Set environment variables: `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`, `OMDB_API_KEY`
3. Build command: `npm run build`
4. Publish directory: `_site`

Serverless functions deploy automatically from `/netlify/functions/`.

## Technologies

- Eleventy 2.0.1 (SSG)
- Contentful (Headless CMS)
- Netlify Functions (Serverless)
- OMDB API (Movie data)
- Vanilla JavaScript (async/await)

## Troubleshooting

## Assignment Requirements

✅ **Serverless Functions** - `netlify/functions/movie.js` handles OMDB API calls  
✅ **Asynchronous Programming** - async/await throughout backend and frontend  
✅ **Dynamic Content** - Live data loads after static page render  
✅ **State Management** - `liveMovieState` caches data, prevents redundant calls

---

**Author**: Sai Trivedi  
**Course**: INFT-3102 Web Development Framework  
**Date**: December 2025