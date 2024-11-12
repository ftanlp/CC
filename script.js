document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('index.json');
        const pages = await response.json();
        
        const tilesContainer = document.getElementById('tilesContainer');
        
        // Load and parse all detail pages
        for (const page of pages) {
            const pageResponse = await fetch(`details/${page}`);
            const pageText = await pageResponse.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(pageText, 'text/html');
            
            // Extract required information
            const title = doc.querySelector('h2').textContent;
            const description = doc.querySelector('.condition-description').textContent;
            const materials = doc.querySelector('.materials-affected').textContent.split(',').map(m => m.trim());
            const imgSrc = doc.querySelector('img').getAttribute('src');
            
            // Create tile
            const tile = createTile(title, description, imgSrc, materials, page);
            tilesContainer.appendChild(tile);
        }
        
        // Filter functionality
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                filterTiles(filter);
                
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
    } catch (error) {
        console.error('Error loading content:', error);
    }
});

function createTile(title, description, imgSrc, materials, pageUrl) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.dataset.materials = materials.join(' ');
    
    const shortDescription = description.slice(0, 100) + '...';
    
    tile.innerHTML = `
        <a href="details/${pageUrl}">
            <img src="${imgSrc}" alt="${title}">
            <h3>${title}</h3>
            <p>${shortDescription}</p>
        </a>
    `;
    
    return tile;
}

function filterTiles(filter) {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        const materials = tile.dataset.materials;
        if (filter === 'all' || materials.includes(filter)) {
            tile.style.display = 'block';
        } else {
            tile.style.display = 'none';
        }
    });
}