function updateClock() {
    const now = new Date();

    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };

    const formatted = now.toLocaleString('en-GB', options).replace(',', '');
    document.getElementById('realtime-clock').textContent = formatted;
}

setInterval(updateClock, 1000);
updateClock();


const searchInput = document.getElementById('searchInput');
const forumItems = document.querySelectorAll('.forum-item');

searchInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
});


searchInput.addEventListener('input', function () {
  const query = this.value.toLowerCase().trim();

  forumItems.forEach(item => {
    const title = item.querySelector('.forum-title')?.innerText.toLowerCase() || '';
    const desc = item.querySelector('.forum-stats')?.innerText.toLowerCase() || '';

    if (title.includes(query) || desc.includes(query)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
});




// Topic Counter Management for Index Page
class IndexTopicManager {
  constructor() {
      this.loadAndUpdateCounts();
      this.setupEventListeners();
  }

  loadAndUpdateCounts() {
      // Load stored counts
      const storedCounts = localStorage.getItem('topic-count');
      if (storedCounts) {
          try {
              const counts = JSON.parse(storedCounts);
              this.updateDisplayCounts(counts);
          } catch (error) {
              console.error('Error loading topic count:', error);
          }
      }
  }

  updateDisplayCounts(counts) {
      // Update individual category counts
      const categoryMappings = {
          'cghs.html': counts.cghs || 12,
          'admin.html': counts.admin || 5,
          'canteen.html': counts.canteen || 3,
          'finance.html': counts.finance || 6,
          'hrd.html': counts.hrd || 5,
          'it.html': counts.it || 6,
          'instrumentation.html': counts.instrumentation || 2,
          'library.html': counts.library || 3,
          'material.html': counts.material || 6,
          'mask.html': counts.mask || 4,
          'public.html': counts.public || 5,
          'qms.html': counts.qms || 4,
          'sspl.html': counts.sspl || 3,
          'sports.html': counts.sports || 2,
          'technical.html': counts.technical || 1,
          'wetcanteen.html': counts.wetcanteen || 1,
          'works.html': counts.works || 1,
          'workshop.html': counts.workshop || 1
      };

      // Update each category count
      Object.entries(categoryMappings).forEach(([href, count]) => {
          const element = document.querySelector(`[href="${href}"]`)?.closest('.forum-item')?.querySelector('.topic-count');
          if (element) {
              element.textContent = count;
          }
      });

      // Calculate and update total count
      const totalCount = Object.values(categoryMappings).reduce((sum, count) => sum + count, 0);
      const totalElement = document.querySelector('.stats-summary .stat-item:nth-child(2) .stat-number');
      if (totalElement) {
          totalElement.textContent = totalCount;
      }
  }

  setupEventListeners() {
      // Listen for storage changes (when other tabs update counts)
      window.addEventListener('storage', (e) => {
          if (e.key === 'topic-count') {
              this.loadAndUpdateCounts();
          }
      });

      // Refresh counts when page becomes visible (user switches back to tab)
      document.addEventListener('visibilitychange', () => {
          if (!document.hidden) {
              this.loadAndUpdateCounts();
          }
      });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Only run on index page
  if (window.location.pathname.includes('index.html') || 
      window.location.pathname === '/' || 
      window.location.pathname.endsWith('/')) {
      new IndexTopicManager();
  }
});

// Add this CSS for visual updates
const style = document.createElement('style');
style.textContent = `
  .topic-count {
      transition: all 0.3s ease;
  }
  
  .topic-count.updated {
      color: #28a745 !important;
      font-weight: bold;
      animation: pulse 2s ease-in-out;
  }
  
  @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
  }
  
  .stat-number.updated {
      color: #28a745 !important;
      animation: countUp 1s ease-out;
  }
  
  @keyframes countUp {
      from { transform: translateY(-10px); opacity: 0.5; }
      to { transform: translateY(0); opacity: 1; }
  }
`;
document.head.appendChild(style);