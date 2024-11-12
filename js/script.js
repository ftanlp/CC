document.addEventListener('DOMContentLoaded', function() {
    initializeHomepage();
});

function initializeHomepage() {
    const tilesContainer = document.getElementById('tilesContainer');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

    if (!tilesContainer) return; // Not on homepage

    loadingElement.style.display = 'block';

    // Create some sample data if index.json isn't loading
    const sampleData = {
        conditions: [
            {
                title: "Abrasion",
                description: "Mechanical wearing, grinding, or rubbing away of material surface.",
                materials: ["textile", "paper"],
                imagePath: "images/placeholder.jpg"
            },
            {
                title: "Foxing",
                description: "Reddish-brown spots or blotches on paper caused by aging and chemical reactions.",
                materials: ["paper", "book"],
                imagePath: "images/placeholder.jpg"
            },
            {
                title: "Delamination",
                description: "Separation of layers in a composite material or coating.",
                materials: ["paper", "metal"],
                imagePath: "images/placeholder.jpg"
            }
        ]
    };

    // First try to fetch the JSON file
    fetch('details/index.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Could not load index.json');
            }
            return response.json();
        })
        .then(data => {
            displayConditions(data.conditions);
        })
        .catch(error => {
            console.log('Falling back to sample data:', error);
            displayConditions(sampleData.conditions);
        })
        .finally(() => {
            loadingElement.style.display = 'none';
        });

    setupFilters();
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
        <a href="details/${condition.title.toLowerCase()}.html">
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