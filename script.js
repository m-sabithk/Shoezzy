// Data Storage
let users = JSON.parse(localStorage.getItem('users')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let products = JSON.parse(localStorage.getItem('products')) || [
    { id: 1, name: "Classic White Sneakers", price: 89.99, image: "https://images.unsplash.com/photo-1528701800486-39a45fdbbd91?w=500&h=500", desc: "Comfortable everyday sneakers" },
    { id: 2, name: "Black Running Shoes", price: 129.99, image: "https://source.unsplash.com/500x500/?black-running-shoes", desc: "Professional running shoe" },
    { id: 3, name: "Leather Oxford Shoes", price: 159.99, image: "https://source.unsplash.com/500x500/?leather-oxford-shoes", desc: "Formal dress shoes" },
    { id: 4, name: "Casual Canvas Slip-ons", price: 69.99, image: "https://source.unsplash.com/500x500/?canvas-slip-ons", desc: "Lightweight casual shoes" },
    { id: 5, name: "Basketball Shoes", price: 149.99, image: "https://source.unsplash.com/500x500/?basketball-shoes", desc: "Sports performance shoes" },
    { id: 6, name: "Summer Sandals", price: 49.99, image: "https://source.unsplash.com/500x500/?summer-sandals", desc: "Comfortable summer footwear" },
    { id: 7, name: "Formal Dress Shoes", price: 189.99, image: "https://source.unsplash.com/500x500/?formal-dress-shoes", desc: "Premium formal shoes" },
    { id: 8, name: "Hiking Boots", price: 179.99, image: "https://source.unsplash.com/500x500/?hiking-boots", desc: "Durable hiking footwear" },
    { id: 9, name: "Pink Sneakers", price: 84.99, image: "https://source.unsplash.com/500x500/?pink-sneakers", desc: "Trendy pink shoes" },
    { id: 10, name: "Women's Running Shoes", price: 124.99, image: "https://source.unsplash.com/500x500/?womens-running-shoes", desc: "Women's sports shoes" },
    { id: 11, name: "Red High Heels", price: 139.99, image: "https://source.unsplash.com/500x500/?red-high-heels", desc: "Elegant high heels" },
    { id: 12, name: "Women's Boots", price: 169.99, image: "https://source.unsplash.com/500x500/?womens-boots", desc: "Premium leather boots" },
    { id: 13, name: "Flats", price: 74.99, image: "https://source.unsplash.com/500x500/?flats-shoes", desc: "Comfortable flat shoes" },
    { id: 14, name: "Women's Gym Shoes", price: 114.99, image: "https://source.unsplash.com/500x500/?womens-gym-shoes", desc: "Training footwear" },
    { id: 15, name: "Black Strappy Heels", price: 144.99, image: "https://source.unsplash.com/500x500/?black-strappy-heels", desc: "Formal heels" },
    { id: 16, name: "Women's Loafers", price: 94.99, image: "https://source.unsplash.com/500x500/?womens-loafers", desc: "Professional loafers" },
    { id: 17, name: "Kids' Colorful Sneakers", price: 54.99, image: "https://source.unsplash.com/500x500/?kids-colorful-sneakers", desc: "Fun kids shoes" },
    { id: 18, name: "Kids' School Shoes", price: 64.99, image: "https://source.unsplash.com/500x500/?kids-school-shoes", desc: "Durable school shoes" },
    { id: 19, name: "Kids' Sports Shoes", price: 69.99, image: "https://source.unsplash.com/500x500/?kids-sports-shoes", desc: "Kids sports footwear" },
    { id: 20, name: "Kids' Slip-ons", price: 49.99, image: "https://source.unsplash.com/500x500/?kids-slip-ons", desc: "Easy kids shoes" },
    { id: 21, name: "Premium Leather Oxfords", price: 249.99, image: "https://source.unsplash.com/500x500/?premium-leather-oxfords", desc: "Luxury formal shoes" },
    { id: 22, name: "Designer Sneakers", price: 199.99, image: "https://source.unsplash.com/500x500/?designer-sneakers", desc: "Limited edition sneakers" },
    { id: 23, name: "Winter Snow Boots", price: 189.99, image: "https://source.unsplash.com/500x500/?winter-snow-boots", desc: "Insulated winter boots" },
    { id: 24, name: "Waterproof Hiking Shoes", price: 169.99, image: "https://source.unsplash.com/500x500/?waterproof-hiking-shoes", desc: "All-terrain hiking shoes" }
];

let currentUser = null;
let cart = [];
let currentProduct = null;
let selectedQty = 1;
let editingProductId = null;

const adminCreds = { email: "admin@shoezzy.com", password: "admin123" };

// ===== Auth Functions =====

function showLogin() {
    switchAuthSection('loginSection');
}

function showSignup() {
    switchAuthSection('signupSection');
}

function showAdminLogin() {
    switchAuthSection('adminLoginSection');
}

function switchAuthSection(sectionId) {
    document.querySelectorAll('.auth-section').forEach(el => el.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const address = document.getElementById('signupAddress').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;

    if (password !== confirm) {
        alert('❌ Passwords do not match!');
        return;
    }

    // Validate email format (proper email structure)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('❌ Please enter a valid email address!');
        return;
    }

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        alert('❌ This email is already registered! Please use a different email.');
        return;
    }

    if (phone.length < 10) {
        alert('❌ Please enter valid phone number!');
        return;
    }

    users.push({
        id: Date.now(),
        name,
        email,
        phone,
        address,
        password,
        createdAt: new Date().toLocaleDateString()
    });

    // persist user list
    localStorage.setItem('users', JSON.stringify(users));

    // if admin is currently viewing the dashboard, refresh counts and customer list
    try {
        loadAdminDashboard();
        loadAdminCustomers();
    } catch (err) {
        // ignore if functions or elements aren't available (e.g. admin not logged in)
    }

    alert('✅ Account created! Please login now.');
    document.querySelector('#signupSection form').reset();
    showLogin();
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('❌ Please enter a valid email address!');
        return;
    }

    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        alert('❌ Invalid email or password!');
        return;
    }

    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showCustomerPage();
    document.querySelector('#loginSection form').reset();
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('❌ Please enter a valid email address!');
        return;
    }

    if (email !== adminCreds.email || password !== adminCreds.password) {
        alert('❌ Invalid admin credentials!');
        return;
    }

    localStorage.setItem('isAdmin', 'true');
    showAdminPage();
    document.querySelector('#adminLoginSection form').reset();
}

function showCustomerPage() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('customerPage').style.display = 'block';
    document.getElementById('adminPage').style.display = 'none';
    loadProducts();
}

function showAdminPage() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('customerPage').style.display = 'none';
    document.getElementById('adminPage').style.display = 'block';
    showAdminSection('dashboard');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        cart = [];
        localStorage.removeItem('currentUser');
        location.reload();
    }
}

function adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isAdmin');
        location.reload();
    }
}

// Check auth on load
window.addEventListener('load', () => {
    const savedUser = localStorage.getItem('currentUser');
    const isAdmin = localStorage.getItem('isAdmin');

    if (isAdmin) {
        showAdminPage();
    } else if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showCustomerPage();
    }
});

// ===== Product Functions =====

function loadProducts() {
    const list = document.getElementById('productList');
    list.innerHTML = products.map(p => `
        <div class="product-card" onclick="openProduct(${p.id})">
            <img src="${p.image}" alt="${p.name}">
            <div class="product-card-info">
                <div class="product-card-name">${p.name}</div>
                <div class="product-card-desc">${p.desc}</div>
                <div class="product-card-footer">
                    <div class="product-card-price">$${p.price.toFixed(2)}</div>
                    <button class="product-card-btn" onclick="event.stopPropagation(); addQuickCart(${p.id})">
                        <i class="fas fa-shopping-cart"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openProduct(id) {
    currentProduct = products.find(p => p.id === id);
    selectedQty = 1;
    
    document.getElementById('modalImage').src = currentProduct.image;
    document.getElementById('modalName').textContent = currentProduct.name;
    document.getElementById('modalDesc').textContent = currentProduct.desc;
    document.getElementById('modalPrice').textContent = `$${currentProduct.price.toFixed(2)}`;
    document.getElementById('qty').value = 1;
    
    document.getElementById('productModal').classList.add('active');
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
}

function increaseQty() {
    const qtyInput = document.getElementById('qty');
    qtyInput.value = parseInt(qtyInput.value) + 1;
}

function decreaseQty() {
    const qtyInput = document.getElementById('qty');
    const val = parseInt(qtyInput.value);
    if (val > 1) qtyInput.value = val - 1;
}

function addToCart() {
    const qty = parseInt(document.getElementById('qty').value);
    const existing = cart.find(item => item.id === currentProduct.id);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({...currentProduct, qty});
    }

    updateCart();
    closeModal();
    alert(`✅ ${currentProduct.name} added to cart!`);
}

function addQuickCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({...product, qty: 1});
    }

    updateCart();
}

function updateCart() {
    document.getElementById('cartCount').textContent = cart.length;
    
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = cart.length === 0 
        ? '<p style="padding: 20px; text-align: center; color: #999;">Your cart is empty</p>'
        : cart.map((item, i) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-qty">
                        <label>Qty:</label>
                        <input type="number" value="${item.qty}" min="1" onchange="changeQty(${i}, this.value)">
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeCart(${i})">Remove</button>
            </div>
        `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

function changeQty(idx, val) {
    cart[idx].qty = Math.max(1, parseInt(val) || 1);
    updateCart();
}

function removeCart(idx) {
    const itemName = cart[idx].name;
    cart.splice(idx, 1);
    updateCart();
    alert(`🗑️ ${itemName} removed from cart!`);
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('active');
}

function goCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const orderItems = cart.map(item => `
        <div class="order-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="order-item-details">
                <strong>${item.name}</strong><br>
                $${item.price.toFixed(2)} x ${item.qty} = $${(item.price * item.qty).toFixed(2)}
            </div>
        </div>
    `).join('');

    document.getElementById('orderItems').innerHTML = orderItems;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const total = subtotal + 10;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('orderTotal').textContent = `$${total.toFixed(2)}`;

    document.getElementById('orderName').value = currentUser.name;
    document.getElementById('orderEmail').value = currentUser.email;
    document.getElementById('orderPhone').value = currentUser.phone;
    document.getElementById('orderAddress').value = currentUser.address;

    document.getElementById('checkoutModal').classList.add('active');
    toggleCart();
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
}

function placeOrder(e) {
    e.preventDefault();
    
    const phone = document.getElementById('orderPhone').value.trim();
    const address = document.getElementById('orderAddress').value.trim();

    if (!phone || !address) {
        alert('Please fill all required fields!');
        return;
    }

    if (phone.length < 10) {
        alert('Please enter valid phone number!');
        return;
    }

    const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0) + 10;

    const order = {
        id: Date.now(),
        userId: currentUser.id,
        items: cart.map(item => ({name: item.name, price: item.price, qty: item.qty})),
        total: orderTotal,
        phone,
        address,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        status: 'pending'
    };

    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    cart = [];
    updateCart();
    closeCheckout();
    
    alert('✅ Order placed successfully! Thank you for shopping with Shoezzy!');
}

function toggleUserMenu() {
    document.getElementById('userMenu').classList.toggle('active');
}

function closeUserMenu() {
    document.getElementById('userMenu').classList.remove('active');
}

// Close menu when clicking elsewhere
document.addEventListener('click', function(e) {
    const userMenu = document.getElementById('userMenu');
    const userBtn = document.querySelector('.user-btn');
    if (userMenu && !userMenu.contains(e.target) && !userBtn.contains(e.target)) {
        closeUserMenu();
    }
});

// ===== Dashboard Functions =====

function showDashboard() {
    const userOrders = orders.filter(o => o.userId === currentUser.id);
    const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
    const wishlistCount = wishlist.filter(w => w.userId === currentUser.id).length;

    document.getElementById('dashTotalOrders').textContent = userOrders.length;
    document.getElementById('dashTotalSpent').textContent = `$${totalSpent.toFixed(2)}`;
    document.getElementById('dashWishlistCount').textContent = wishlistCount;
    document.getElementById('dashMemberSince').textContent = currentUser.createdAt;

    const recentOrders = userOrders.slice(-3).reverse().map(o => `
        <div class="order-record">
            <h4>#Order ${o.id}</h4>
            <p><strong>Date:</strong> ${o.date} ${o.time}</p>
            <p><strong>Items:</strong> ${o.items.map(i => i.name).join(', ')}</p>
            <p><strong>Total:</strong> $${o.total.toFixed(2)}</p>
            <span class="order-status ${o.status}">${o.status.toUpperCase()}</span>
        </div>
    `).join('');

    document.getElementById('dashRecentOrders').innerHTML = recentOrders || '<p>No orders yet</p>';
    document.getElementById('dashboardModal').classList.add('active');
    closeUserMenu();
}

function closeDashboard() {
    document.getElementById('dashboardModal').classList.remove('active');
}

// ===== Profile Functions =====

function showProfile() {
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profilePhone').textContent = currentUser.phone;
    document.getElementById('profileAddress').textContent = currentUser.address;
    document.getElementById('profileMemberSince').textContent = currentUser.createdAt;

    document.getElementById('profileModal').classList.add('active');
    closeUserMenu();
}

function closeProfile() {
    document.getElementById('profileModal').classList.remove('active');
}

// ===== Orders Functions =====

function showMyOrders() {
    const userOrders = orders.filter(o => o.userId === currentUser.id);
    
    const content = userOrders.length ? userOrders.reverse().map(o => `
        <div class="order-record">
            <h4><i class="fas fa-box"></i> Order #${o.id}</h4>
            <p><strong>Date & Time:</strong> ${o.date} ${o.time}</p>
            <p><strong>Items:</strong> ${o.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</p>
            <p><strong>Total Amount:</strong> $${o.total.toFixed(2)}</p>
            <p><strong>Delivery Address:</strong> ${o.address}</p>
            <p><strong>Phone:</strong> ${o.phone}</p>
            <span class="order-status ${o.status}">${o.status === 'pending' ? '⏳ PENDING' : '✅ COMPLETED'}</span>
        </div>
    `).join('') : '<p style="text-align: center; padding: 30px; color: #999;">No orders yet. Start shopping!</p>';

    document.getElementById('ordersContent').innerHTML = content;
    document.getElementById('ordersModal').classList.add('active');
    closeUserMenu();
}

function closeOrders() {
    document.getElementById('ordersModal').classList.remove('active');
}

// ===== Wishlist Functions =====

function addToWishlist() {
    if (!currentProduct) return;

    const existing = wishlist.find(w => w.userId === currentUser.id && w.productId === currentProduct.id);
    
    if (existing) {
        alert('Already in wishlist!');
        return;
    }

    wishlist.push({
        userId: currentUser.id,
        productId: currentProduct.id,
        product: currentProduct,
        addedAt: new Date().toLocaleDateString()
    });

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    alert(`❤️ ${currentProduct.name} added to wishlist!`);
}

function showWishlist() {
    const userWishlist = wishlist.filter(w => w.userId === currentUser.id);
    
    const content = userWishlist.length ? userWishlist.map((item, idx) => `
        <div class="wishlist-item">
            <img src="${item.product.image}" alt="${item.product.name}">
            <div class="wishlist-item-info">
                <div class="wishlist-item-name">${item.product.name}</div>
                <div class="wishlist-item-price">$${item.product.price.toFixed(2)}</div>
                <p style="font-size: 12px; color: #999; margin: 5px 0;">${item.product.desc}</p>
            </div>
            <button class="remove-wishlist" onclick="removeFromWishlist(${idx})">Remove</button>
        </div>
    `).join('') : '<p style="text-align: center; padding: 30px; color: #999;">Wishlist is empty</p>';

    document.getElementById('wishlistContent').innerHTML = content;
    document.getElementById('wishlistModal').classList.add('active');
    closeUserMenu();
}

function removeFromWishlist(idx) {
    const userWishlistIndices = wishlist
        .map((w, i) => w.userId === currentUser.id ? i : -1)
        .filter(i => i !== -1);
    
    wishlist.splice(userWishlistIndices[idx], 1);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    showWishlist();
    alert('Removed from wishlist!');
}

function closeWishlist() {
    document.getElementById('wishlistModal').classList.remove('active');
}

// ===== Contact Functions =====

function handleContact(e) {
    e.preventDefault();
    alert('✅ Thank you for contacting us! We will get back to you soon.');
    e.target.reset();
}

// ===== Scroll Function =====

function scrollTo(section) {
    const element = document.getElementById(section);
    if (element) {
        element.scrollIntoView({behavior: 'smooth'});
    }
}

// ===== ADMIN FUNCTIONS =====

function showAdminSection(name) {
    document.querySelectorAll('.admin-section').forEach(el => el.classList.remove('active'));
    document.getElementById(name + 'Section').classList.add('active');

    document.querySelectorAll('.sidebar-link').forEach(el => el.classList.remove('active'));
    event.target.closest('.sidebar-link').classList.add('active');

    if (name === 'dashboard') loadAdminDashboard();
    else if (name === 'orders') loadAdminOrders();
    else if (name === 'customers') loadAdminCustomers();
    else if (name === 'products') loadAdminProducts();
}

function loadAdminDashboard() {
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalCustomers').textContent = users.length;
    document.getElementById('totalRevenue').textContent = `$${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}`;
    document.getElementById('totalProducts').textContent = products.length;
}

function loadAdminOrders() {
    const list = document.getElementById('adminOrdersList');
    
    if (orders.length === 0) {
        list.innerHTML = '<p style="padding: 30px; text-align: center; color: #999;">No orders yet</p>';
        return;
    }

    list.innerHTML = orders.reverse().map(o => {
        const user = users.find(u => u.id === o.userId);
        return `
            <div class="order-card">
                <h4><i class="fas fa-box"></i> Order #${o.id}</h4>
                <p><strong>Customer:</strong> ${user ? user.name : 'Unknown'}</p>
                <p><strong>Email:</strong> ${user ? user.email : 'N/A'}</p>
                <p><strong>Phone:</strong> ${o.phone}</p>
                <p><strong>Address:</strong> ${o.address}</p>
                <p><strong>Date:</strong> ${o.date} ${o.time}</p>
                <p><strong>Items:</strong> ${o.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</p>
                <p><strong>Total:</strong> $${o.total.toFixed(2)}</p>
                <span class="order-status ${o.status}">${o.status === 'pending' ? '⏳ PENDING' : '✅ COMPLETED'}</span>
            </div>
        `;
    }).join('');
}

function loadAdminCustomers() {
    const list = document.getElementById('adminCustomersList');
    
    if (users.length === 0) {
        list.innerHTML = '<p style="padding: 30px; text-align: center; color: #999;">No customers yet</p>';
        return;
    }

    list.innerHTML = users.map(user => {
        const userOrders = orders.filter(o => o.userId === user.id);
        const userSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
        return `
            <div class="customer-card">
                <h4><i class="fas fa-user"></i> ${user.name}</h4>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Address:</strong> ${user.address}</p>
                <p><strong>Member Since:</strong> ${user.createdAt}</p>
                <p><strong>Total Orders:</strong> ${userOrders.length}</p>
                <p><strong>Total Spent:</strong> $${userSpent.toFixed(2)}</p>
            </div>
        `;
    }).join('');
}

function loadAdminProducts() {
    const list = document.getElementById('adminProductsList');
    
    list.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <div class="product-info">
                <h4>${p.name}</h4>
                <p>${p.desc}</p>
                <p><strong>Price:</strong> $${p.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button class="edit-btn" onclick="editProduct(${p.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="deleteProduct(${p.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function showAddProduct() {
    editingProductId = null;
    document.getElementById('addProductModal').classList.add('active');
    document.querySelector('#addProductModal h2').innerHTML = '<i class="fas fa-plus"></i> Add New Product';
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productDescription').value = '';
    document.querySelector('#addProductModal button[type="submit"]').textContent = 'Add Product';
}

function closeAddProduct() {
    document.getElementById('addProductModal').classList.remove('active');
    editingProductId = null;
}

function editProduct(id) {
    editingProductId = id;
    const product = products.find(p => p.id === id);
    
    if (!product) {
        alert('Product not found!');
        return;
    }

    document.querySelector('#addProductModal h2').innerHTML = '<i class="fas fa-edit"></i> Edit Product';
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productDescription').value = product.desc;
    document.querySelector('#addProductModal button[type="submit"]').textContent = 'Update Product';
    
    document.getElementById('addProductModal').classList.add('active');
}

function saveProduct(e) {
    e.preventDefault();

    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const image = document.getElementById('productImage').value.trim();
    const desc = document.getElementById('productDescription').value.trim();

    if (!name || !price || !image || !desc) {
        alert('❌ Please fill all fields!');
        return;
    }

    if (price <= 0) {
        alert('❌ Price must be greater than 0!');
        return;
    }

    if (editingProductId) {
        // Update existing product
        const productIndex = products.findIndex(p => p.id === editingProductId);
        if (productIndex !== -1) {
            products[productIndex] = {
                id: editingProductId,
                name,
                price,
                image,
                desc
            };
            alert(`✅ Product "${name}" updated successfully!`);
        }
    } else {
        // Add new product
        const newProduct = {
            id: Math.max(...products.map(p => p.id), 0) + 1,
            name,
            price,
            image,
            desc
        };
        products.push(newProduct);
        alert(`✅ Product "${name}" added successfully!`);
    }

    localStorage.setItem('products', JSON.stringify(products));
    document.querySelector('#addProductModal form').reset();
    closeAddProduct();
    loadAdminProducts();
    loadAdminDashboard();
}

function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) {
        alert('Product not found!');
        return;
    }

    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        alert('🗑️ Product deleted successfully!');
        loadAdminProducts();
        loadAdminDashboard();
    }
}
