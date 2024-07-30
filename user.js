document.addEventListener('DOMContentLoaded', function() {
    const menuForm = document.getElementById('menuForm');
    const menuItemsContainer = document.getElementById('menu-items');
    const sortOptions = document.getElementById('sortOptions');
    const priceFilter = document.getElementById('priceFilter');
    const priceRange = document.getElementById('priceRange');
    const logoutButton = document.getElementById('logoutButton');
    const paginationContainer = document.getElementById('pagination-container');

    let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    const itemsPerPage = 6;
    let currentPage = 1;

    function displayMenuItems(items) {
        const paginatedItems = paginate(items, itemsPerPage, currentPage);
        menuItemsContainer.innerHTML = paginatedItems.map(item => `
            <div class="col-md-4 mb-3">
                <div class="card h-100">
                    <img src="${item.imageUrl}" class="card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <p class="btn btn-primary">${item.name}</p>
                        <p class="btn btn-warning ">$${item.price}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function paginate(items, itemsPerPage, page) {
        const start = (page - 1) * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
    }

    function setupPagination(items) {
        const pageCount = Math.ceil(items.length / itemsPerPage);
        paginationContainer.innerHTML = '';

        const prevPageItem = document.createElement('li');
        prevPageItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevPageItem.innerHTML = `<a class="page-link" href="#">Previous</a>`;
        prevPageItem.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                updateDisplay();
            }
        });
        paginationContainer.appendChild(prevPageItem);

        for (let i = 1; i <= pageCount; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
            pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageItem.addEventListener('click', function(e) {
                e.preventDefault();
                currentPage = i;
                updateDisplay();
            });
            paginationContainer.appendChild(pageItem);
        }

        const nextPageItem = document.createElement('li');
        nextPageItem.className = `page-item ${currentPage === pageCount ? 'disabled' : ''}`;
        nextPageItem.innerHTML = `<a class="page-link" href="#">Next</a>`;
        nextPageItem.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentPage < pageCount) {
                currentPage++;
                updateDisplay();
            }
        });
        paginationContainer.appendChild(nextPageItem);
    }

    function sortMenuItems(items, sortOrder) {
        if (sortOrder === 'asc') {
            return items.slice().sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'desc') {
            return items.slice().sort((a, b) => b.price - a.price);
        }
        return items;
    }

    function filterMenuItemsByPrice(items, maxPrice) {
        return items.filter(item => item.price <= maxPrice);
    }

    function updateDisplay() {
        const sortOrder = sortOptions.value;
        const maxPrice = parseFloat(priceFilter.value);

        let filteredItems = filterMenuItemsByPrice(menuItems, maxPrice);
        let sortedItems = sortMenuItems(filteredItems, sortOrder);

        displayMenuItems(sortedItems);
        setupPagination(sortedItems);
    }

    // Initial display and setup
    updateDisplay();

    sortOptions.addEventListener('change', function() {
        currentPage = 1;
        updateDisplay();
    });

    priceFilter.addEventListener('input', function() {
        currentPage = 1;
        priceRange.textContent = `0 - ${priceFilter.value}`;
        updateDisplay();
    });

    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('token');
        alert('You have been logged out');
        window.location.href = 'index.html';
    });
});
