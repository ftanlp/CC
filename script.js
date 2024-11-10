// Sample data - Replace with your actual data
const materialsData = [
    {
        id: 1,
        title: "Cotton Fabric",
        image: "https://placeholder.com/400x300",
        description: "Natural cotton fabric suitable for various applications",
        material: "textile",
        treatment: "Washing, Ironing, Dry cleaning",
        shortDescription: "Premium quality cotton fabric"
    },
    // Add more items as needed
];

// Check if we're on the index page or details page
if (document.querySelector('.grid-container')) {
    // Index page functionality
    initializeGrid();
    initializeFilters();
} else if (document.querySelector('.details-container')) {
    // Details page functionality
    loadDetails();
}

function initializeGrid() {
    const container = document.querySelector('.grid-container');
    
    materialsData.forEach(item => {
        const gridItem = createGridItem(item);
        container.appendChild(gridItem);
    });
}

function createGridItem(item) {
    const article = document.createElement('a');
    article.href = `details.html?id=${item.id}`;
    article.className = `grid-item ${item.material}`;
    
    article.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="grid-content">
            <h2 class="grid-title">${item.title}</h2>
            <p class="grid-description">${item.shortDescription}</p>
        </div>
    `;
    
    return article;
}

function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            filterGrid(filter);
        });
    });
}

function filterGrid(filter) {
    const items = document.querySelectorAll('.grid-item');
    
    items.forEach(item => {
        if (filter === 'all' || item.classList.contains(filter)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function loadDetails() {
    // Get the item ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = parseInt(urlParams.get('id'));
    
    // Find the item in our data
    const item = materialsData.find(item => item.id === itemId);
    
    if (item) {
        // Populate the details page
        document.getElementById('title').textContent = item.title;
        document.getElementById('main-image').src = item.image;
        document.getElementById('main-image').alt = item.title;
        document.getElementById('description').textContent = item.description;
        document.getElementById('treatment').textContent = item.treatment;
        document.getElementById('material').textContent = item.material;
    }
}
