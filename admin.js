document.addEventListener('DOMContentLoaded', function() {
    const menuForm = document.getElementById('menuForm');
    const menuItemsContainer = document.getElementById('menu-items');
    const sortOptions = document.getElementById('sortOptions');
    const priceFilter = document.getElementById('priceFilter');
    const priceRange = document.getElementById('priceRange');
    const logoutButton = document.getElementById('logoutButton');

    let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];

    displayMenuItems(menuItems);

    menuForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const itemName = document.getElementById('itemName').value;
        const itemPrice = parseFloat(document.getElementById('itemPrice').value);
        const itemImageUrl = document.getElementById('itemImageUrl').value;

        const editItemId = document.getElementById('editItemId');

        if (editItemId && editItemId.value) {
            const itemId = parseInt(editItemId.value);
            const itemIndex = menuItems.findIndex(menuItem => menuItem.id === itemId);
            if (itemIndex > -1) {
                menuItems[itemIndex] = { id: itemId, name: itemName, price: itemPrice, imageUrl: itemImageUrl };
            }
            editItemId.remove();
            menuForm.querySelector('button[type="submit"]').textContent = 'Add Item';
            menuForm.querySelector('button[type="submit"]').className = 'btn btn-primary';
        } else {
            addItemToList(itemName, itemPrice, itemImageUrl);
        }
        menuForm.reset();
        displayMenuItems(menuItems);
        saveToLocalStorage(menuItems);
    });

    sortOptions.addEventListener('change', function() {
        const sortedItems = sortMenuItems(menuItems, sortOptions.value);
        displayMenuItems(sortedItems);
    });

    priceFilter.addEventListener('input', function() {
        priceRange.textContent = `0 - ${priceFilter.value}`;
        const filteredItems = filterMenuItemsByPrice(menuItems, parseFloat(priceFilter.value));
        displayMenuItems(filteredItems);
    });

    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('token');
        alert('You have been logged out');
        window.location.href = 'index.html';
    });

    function addItemToList(name, price, imageUrl) {
        const newItem = { id: Date.now(), name, price, imageUrl };
        menuItems.push(newItem);
    }

    function displayMenuItems(items) {
        menuItemsContainer.innerHTML = items.map(item => `
            <div class="col-md-4 mb-3">
                <div class="card h-100">
                    <img src="${item.imageUrl}" class="card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">$${item.price}</p>
                        <button class="btn btn-warning btn-sm edit-button" data-id="${item.id}">Edit</button>
                        <button class="btn btn-danger btn-sm remove-button" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');

        addEventListenersToButtons();
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

    function addEventListenersToButtons() {
        menuItemsContainer.querySelectorAll('.remove-button').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                menuItems = menuItems.filter(menuItem => menuItem.id !== itemId);
                displayMenuItems(menuItems);
                saveToLocalStorage(menuItems);
            });
        });

        menuItemsContainer.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                editItem(itemId);
            });
        });
    }

    function editItem(itemId) {
        const item = menuItems.find(menuItem => menuItem.id === itemId);
        if (item) {
            document.getElementById('itemName').value = item.name;
            document.getElementById('itemPrice').value = item.price;
            document.getElementById('itemImageUrl').value = item.imageUrl;
            let editItemId = document.getElementById('editItemId');
            if (!editItemId) {
                editItemId = document.createElement('input');
                editItemId.type = 'hidden';
                editItemId.id = 'editItemId';
                menuForm.appendChild(editItemId);
            }
            editItemId.value = item.id;

            const submitButton = menuForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Save Changes';
            submitButton.className = 'btn btn-success';
        }
    }

    function saveToLocalStorage(items) {
        localStorage.setItem('menuItems', JSON.stringify(items));
    }
});
