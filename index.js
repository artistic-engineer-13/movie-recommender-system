const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // If needed

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`); 
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie data' });
  }
});

// IMPORTANT: Export the app (do not listen)
module.exports = app;
