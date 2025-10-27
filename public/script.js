const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');

function stripHtml(html) {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}

async function searchMovies(query) {
  if (!query.trim()) {
    resultsDiv.innerHTML = '<div class="no-results">Please enter a search term</div>';
    return;
  }

  loadingDiv.classList.add('show');
  resultsDiv.innerHTML = '';

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch results');
    }

    const data = await response.json();
    loadingDiv.classList.remove('show');

    if (data.length === 0) {
      resultsDiv.innerHTML = '<div class="no-results">No results found. Try a different search term.</div>';
      return;
    }

    displayResults(data);
  } catch (error) {
    loadingDiv.classList.remove('show');
    resultsDiv.innerHTML = '<div class="no-results">Error fetching results. Please try again.</div>';
    console.error('Error:', error);
  }
}

function displayResults(shows) {
  resultsDiv.innerHTML = shows.map(item => {
    const show = item.show;
    const imageUrl = show.image?.medium || 'https://via.placeholder.com/280x400?text=No+Image';
    const summary = show.summary ? stripHtml(show.summary) : 'No description available.';
    const rating = show.rating?.average ? show.rating.average : 'N/A';
    const genres = show.genres && show.genres.length > 0
      ? show.genres.map(g => `<span class="genre-tag">${g}</span>`).join('')
      : '<span class="genre-tag">Unknown</span>';

    const statusClass = show.status === 'Ended' ? 'ended' : '';
    const premiered = show.premiered ? new Date(show.premiered).getFullYear() : 'N/A';
    const network = show.network?.name || show.webChannel?.name || 'N/A';

    return `
      <div class="movie-card">
        <img src="${imageUrl}" alt="${show.name}" class="movie-image" onerror="this.src='https://via.placeholder.com/280x400?text=No+Image'">
        <div class="movie-info">
          <h2 class="movie-title">${show.name}</h2>
          <div class="movie-meta">
            <span class="badge badge-type">${show.type || 'Unknown'}</span>
            <span class="badge badge-status ${statusClass}">${show.status || 'Unknown'}</span>
            ${rating !== 'N/A' ? `<span class="badge badge-rating">★ ${rating}</span>` : ''}
          </div>
          <div class="movie-genres">
            ${genres}
          </div>
          <p class="movie-summary">${summary.substring(0, 150)}${summary.length > 150 ? '...' : ''}</p>
          <div class="movie-details">
            <p><strong>Premiered:</strong> ${premiered}</p>
            <p><strong>Network:</strong> ${network}</p>
            <p><strong>Language:</strong> ${show.language || 'N/A'}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

searchBtn.addEventListener('click', () => {
  searchMovies(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchMovies(searchInput.value);
  }
});
