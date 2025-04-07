class ClientSearch {
  constructor() {
    this.searchInput = document.getElementById('client-search-input');
    this.resultsContainer = document.getElementById('client-search-results');
    this.noResults = document.querySelector('.no-results');
    this.loadingIndicator = document.querySelector('.loading-indicator');

    if (!this.searchInput || !this.resultsContainer) {
      console.error('Client search elements not found');
      return;
    }

    this.initialize();
  }

  initialize() {
    this.searchInput.addEventListener('input', this.debouncedSearch.bind(this));
    this.resultsContainer.addEventListener('click', this.handleSelection.bind(this));
    this.searchInput.addEventListener('keydown', this.handleKeyboard.bind(this));
  }

  debouncedSearch = this.debounce(async (e) => {
    const query = e.target.value.trim();
    if (query.length < 2) return this.clearResults();

    try {
      this.showLoading(true);
      const results = await this.fetchClients(query);
      this.displayResults(results);
    } catch (error) {
      console.error('Search error:', error);
      this.showError();
    } finally {
      this.showLoading(false);
    }
  }, 300);

  // Rest of the class remains the same as previous version
  // ... (displayResults, handleSelection, etc) ...
}

// Helper function for debounce
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}