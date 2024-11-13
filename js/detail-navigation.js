// detail-navigation.js - Handles the detail pages navigation

document.addEventListener('DOMContentLoaded', function() {
    initializeDetailPage();
});

function initializeDetailPage() {
    setupDetailNavigation();
    setupImageHandling();
    setupNavigationBoundary();
}

function setupDetailNavigation() {
    // Get current page filename
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop();

    // Fetch and process index.json
    fetch('/details/index.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load navigation data');
            }
            return response.json();
        })
        .then(data => {
            updateNavigationControls(data.conditions, currentFile);
        })
        .catch(error => {
            console.error('Navigation error:', error);
            hideNavigationControls();
        });
}

function updateNavigationControls(conditions, currentFile) {
    const currentIndex = conditions.findIndex(condition => 
        condition.URL.includes(currentFile)
    );

    if (currentIndex === -1) {
        hideNavigationControls();
        return;
    }

    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    // Update previous button
    if (currentIndex > 0) {
        const prevCondition = conditions[currentIndex - 1];
        enableNavigationButton(prevButton, prevCondition.URL);
    } else {
        disableNavigationButton(prevButton);
    }

    // Update next button
    if (currentIndex < conditions.length - 1) {
        const nextCondition = conditions[currentIndex + 1];
        enableNavigationButton(nextButton, nextCondition.URL);
    } else {
        disableNavigationButton(nextButton);
    }
}

function enableNavigationButton(button, url) {
    button.href = url;
    button.classList.remove('disabled');
    button.style.opacity = '1';
    button.style.pointerEvents = 'auto';
}

function disableNavigationButton(button) {
    button.href = '#';
    button.classList.add('disabled');
    button.style.opacity = '0.5';
    button.style.pointerEvents = 'none';
}

function hideNavigationControls() {
    const navControls = document.querySelector('.navigation-controls');
    if (navControls) {
        navControls.style.display = 'none';
    }
}

function setupImageHandling() {
    const images = document.querySelectorAll('.image-column img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = '../images/placeholder.jpg';
            this.alt = 'Image not available';
        });
    });
}

function setupNavigationBoundary() {
    const footer = document.querySelector('footer');
    const navControls = document.querySelector('.navigation-controls');
    const mainContent = document.querySelector('main');
    
    if (!footer || !navControls || !mainContent) return;

    function updateNavigationPosition() {
        const footerTop = footer.getBoundingClientRect().top;
        const navHeight = navControls.offsetHeight;
        const windowHeight = window.innerHeight;
        const buffer = 20; // Space between navigation and footer

        if (footerTop <= windowHeight) {
            // Calculate the distance from the bottom of the viewport to the footer
            const distanceToFooter = windowHeight - footerTop;
            // Calculate new bottom position for nav controls
            const newBottom = Math.min(distanceToFooter + buffer, windowHeight - navHeight - buffer);
            
            // Apply the new position
            navControls.style.position = 'fixed';
            navControls.style.bottom = `${newBottom}px`;
        } else {
            // Reset to default position
            navControls.style.position = 'fixed';
            navControls.style.bottom = '2rem';
        }
    }

    // Create a ResizeObserver to monitor changes in the main content
    const resizeObserver = new ResizeObserver(entries => {
        updateNavigationPosition();
    });

    // Observe the main content
    resizeObserver.observe(mainContent);

    // Add scroll event listener with throttling
    let ticking = false;
    document.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateNavigationPosition();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateNavigationPosition();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial position check
    updateNavigationPosition();
}