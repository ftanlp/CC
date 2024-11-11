// Sample data structure that would be loaded from index.json
const pages = ['details/abrasion.html', 'details/foxing.html'];

// Function to fetch and parse HTML content
async function fetchHTML(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        return parser.parseFromString(text, 'text/html');
    } catch (error) {
        console.error('Error fetching HTML:', error);
        return null;
    }
}

// Function to extract preview data from detail pages
async function extractPreviewData(url) {
    const doc = await fetchHTML(url);
    if (!doc) return null;

    return {
        title: doc.querySelector('.detail-title').textContent,
        description: doc.querySelector('.description').textContent,
        image: doc.querySelector('.detail-image').src,
        material: doc.querySelector('.material').textContent,
        url: url
    };
}

// Function to create grid items
function createGridItem(data) {
    const gridItem = document.createElement('a');
    gridItem.href = data.url;
    gridItem.className = `grid-item ${data.material.toLowerCase()}`;
    
    gridItem.innerHTML = `
        <img src="${data.image}" alt="${data.title}">
        <div class="grid-content">
            <h2 class="grid-title">${data.title}</h2>
            <p class="grid-description">${data.description.substring(0, 100)}...</p>
        </div>
    `;
    
    return gridItem;
}

// Function to initialize the grid
async function initializeGrid() {
    const gridContainer = document.getElementById('gridContainer');
    const previewData = await Promise.all(pages.map(page => extractPreviewData(page)));
    
    previewData.forEach(data => {
        if (data) {
            const gridItem = createGridItem(data);
            gridContainer.appendChild(gridItem);
        }
    });
}

// Function to handle material filtering
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter grid items
            const gridItems = document.querySelectorAll('.grid-item');
            gridItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeGrid();
    initializeFilters();
});