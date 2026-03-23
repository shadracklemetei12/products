//Products array
const products = [
    {name:"Wireless Headphones", price:15, image:"headphones.webp", description:"Noise cancelling headphones.", category:"Electronics", rating:4.5},
    {name:"Smart Watch", price:28, image:"smartwatch.webp", description:"Track fitness & notifications.", category:"Wearables", rating:4.7},
    {name:"Bluetooth Speaker", price:7, image:"speaker.webp", description:"Portable high-quality speaker.", category:"Electronics", rating:4.3},
    {name:"Running Shoes", price:33, image:"shoes.webp", description:"Comfortable & lightweight.", category:"Footwear", rating:4.6},
    {name:"Sunglasses", price:21, image:"sunglasses.webp", description:"Stylish UV protection.", category:"Accessories", rating:4.2},
    {name:"Fitness Band", price:25, image:"fitness band.webp", description:"Monitor your health easily.", category:"Wearables", rating:4.4}
];

//Select elements
const container = document.getElementById('products-container');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const clearCartBtn = document.getElementById('clear-cart');
const categoryFilter = document.getElementById('category-filter');
const sortBy = document.getElementById('sort-by');
const searchBar = document.getElementById('search-bar');

let total = 0;
let cart = [];

//Load cart from localStorage
if(localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
    cart.forEach(item => renderCartItem(item));
}

//Initialize category filter
const categories = ["All", ...new Set(products.map(p => p.category))];
categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
});

//Render products
function renderProducts(list) {
    container.innerHTML = '';
    list.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>Category: ${product.category}</p>
            <p>Rating: ${product.rating} ⭐</p>
            <p><strong>Price: $${product.price}</strong></p>
            <button>Add to Cart</button>
        `;

        const button = productDiv.querySelector('button');
        button.addEventListener('click', () => addToCart(product));

        container.appendChild(productDiv);
    });
}

//Add to cart
function addToCart(product) {
    cart.push(product);
    renderCartItem(product);
    saveCart();
}

// Render single cart item
function renderCartItem(product) {
    const li = document.createElement('li');
    li.textContent = `${product.name} - $${product.price}`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = "Remove";
    removeBtn.style.marginLeft = "10px";
    removeBtn.addEventListener('click', () => {
        li.remove();
        cart = cart.filter(p => p !== product);
        saveCart();
        updateTotal();
    });

    li.appendChild(removeBtn);
    cartItems.appendChild(li);

    updateTotal();
}

// Update total
function updateTotal() {
    total = cart.reduce((acc, item) => acc + item.price, 0);
    cartTotal.textContent = total;
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Clear cart
clearCartBtn.addEventListener('click', () => {
    cart = [];
    cartItems.innerHTML = '';
    saveCart();
    updateTotal();
});

// Filter & sort
function filterAndSort() {
    let filtered = [...products];

    // Filter category
    if(categoryFilter.value !== "All") {
        filtered = filtered.filter(p => p.category === categoryFilter.value);
    }

    // Search
    const searchValue = searchBar.value.toLowerCase();
    if(searchValue) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchValue));
    }

    // Sort
    switch(sortBy.value) {
        case "price-asc":
            filtered.sort((a,b) => a.price - b.price);
            break;
        case "price-desc":
            filtered.sort((a,b) => b.price - a.price);
            break;
        case "rating-desc":
            filtered.sort((a,b) => b.rating - a.rating);
            break;
    }

    renderProducts(filtered);
}

// Event listeners for filter, sort, and search
categoryFilter.addEventListener('change', filterAndSort);
sortBy.addEventListener('change', filterAndSort);
searchBar.addEventListener('input', filterAndSort);

// Initial render
renderProducts(products);
updateTotal();