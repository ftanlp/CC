document.addEventListener('DOMContentLoaded', function() {
    // Only run on homepage
    if (!document.querySelector('.tiles-container')) return;

    // Fetch and load conditions
    fetch('details/index.json')
        .then(response => response.json())
        .then(data => {
            loadConditions(data.conditions);
            setupFilters();
        });
});

async function loadConditions(conditions) {
    const tilesContainer = document.querySelector('.tiles-container');
    
    for (const condition of conditions) {
        const response = await fetch(`details/${condition.file}`);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        
        const title = doc.querySelector('h2').textContent;
        const description = doc.querySelector('.condition-description').textContent;
        const materials = condition.materials;
        const imgSrc = doc.querySelector('.image-column img').src;
        
        const tile = createTile(title, description, imgSrc, condition.file, materials);
        tilesContainer.appendChild(tile);
    }
}

function createTile(title, description, imgSrc, link, materials) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.dataset.materials = materials.join(' ');
    
    tile.innerHTML = `
        <a href="details/${link}">
            <img src="${imgSrc}" alt="${title}">
            <div class="tile-content">
                <h3>${title}</h3>
                <p>${description.substring(0, 100)}...</p>
            </div>
        </a>
    `;
    
    return tile;
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const tiles = document.querySelectorAll('.tile');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
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