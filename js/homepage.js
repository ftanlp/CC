// homepage.js - Handles the main page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeHomepage();
});

function initializeHomepage() {
    const tilesContainer = document.getElementById('tilesContainer');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

    if (!tilesContainer) return; // Not on homepage

    loadingElement.style.display = 'block';

    // Fetch the condition data
    fetch('details/index.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Could not load index.json');
            }
            return response.json();
        })
        .then(data => {
            displayConditions(data.conditions);
            setupFilters();
        })
        .catch(error => {
            console.error('Error loading data:', error);
            errorElement.style.display = 'block';
            errorElement.textContent = 'Error loading content. Please try again later.';
        })
        .finally(() => {
            loadingElement.style.display = 'none';
        });
}

function displayConditions(conditions) {
    const tilesContainer = document.getElementById('tilesContainer');
    tilesContainer.innerHTML = ''; // Clear existing content

    conditions.forEach(condition => {
        const tile = createTile(condition);
        tilesContainer.appendChild(tile);
    });
}

function createTile(condition) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.dataset.materials = condition.materials.join(' ');
    
    tile.innerHTML = `
        <a href="${condition.URL}">
            <img src="${condition.imagePath}" alt="${condition.title}">
            <div class="tile-content">
                <h3>${condition.title}</h3>
                <p>${condition.description}</p>
            </div>
        </a>
    `;
    
    return tile;
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter tiles
            const tiles = document.querySelectorAll('.tile');
            tiles.forEach(tile => {
                if (filter === 'all' || tile.dataset.materials.includes(filter)) {
                    tile.style.display = 'block';
                } else {
                    tile.style.display = 'none';
                }
            });
        });
    });
}