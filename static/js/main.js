// Main JavaScript for E-commerce

document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count
    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }
    
    // Add to cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.closest('.product-info').querySelector('h3').textContent;
            const productPrice = this.closest('.product-info').querySelector('.product-price').textContent;
            
            // Remove ৳ symbol and convert to number
            const price = parseFloat(productPrice.replace('৳', ''));
            
            // Check if product already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: price,
                    quantity: 1
                });
            }
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count
            updateCartCount();
            
            // Show success message
            showNotification('Product added to cart!', 'success');
        });
    });
    
    // Quick View Modal
    const modal = document.getElementById('quickViewModal');
    const closeModal = document.querySelector('.close-modal');
    
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            // In a real application, you would fetch product details via AJAX
            showQuickView(productId);
        });
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    function showQuickView(productId) {
        // For now, show a placeholder
        const modalContent = document.getElementById('modal-product-details');
        modalContent.innerHTML = `
            <h2>Product Details</h2>
            <p>Product ID: ${productId}</p>
            <p>Full product details would be loaded here via AJAX.</p>
            <button class="btn add-to-cart" data-id="${productId}">Add to Cart</button>
        `;
        
        modal.style.display = 'block';
        
        // Re-attach event listener to the new button
        modalContent.querySelector('.add-to-cart').addEventListener('click', function() {
            // Add to cart logic here
            showNotification('Product added from quick view!', 'success');
        });
    }
    
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#0066cc' : '#cc0000'};
            color: white;
            border-radius: 5px;
            z-index: 1002;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Add close button functionality
        notification.querySelector('.close-notification').addEventListener('click', function() {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }
    
    // Animation for notification
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .close-notification {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize cart count
    updateCartCount();
});
















    // Shop Page Functionality
    if (window.location.pathname === '/shop/' || window.location.pathname === '/shop') {
        initializeShopFilters();
    }
    
    function initializeShopFilters() {
        // Filter Toggle for Mobile
        const filterToggle = document.getElementById('filterToggle');
        const filtersSidebar = document.getElementById('filtersSidebar');
        const closeFilters = document.getElementById('closeFilters');
        
        if (filterToggle && filtersSidebar) {
            filterToggle.addEventListener('click', function() {
                filtersSidebar.classList.toggle('active');
            });
            
            if (closeFilters) {
                closeFilters.addEventListener('click', function() {
                    filtersSidebar.classList.remove('active');
                });
            }
        }
        
        // Product filtering
        const productCards = document.querySelectorAll('.shop-card');
        const searchInput = document.getElementById('searchInput');
        const sortSelect = document.getElementById('sortSelect');
        const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
        const stockCheckboxes = document.querySelectorAll('input[name="stock"]');
        const minPriceInput = document.getElementById('minPrice');
        const maxPriceInput = document.getElementById('maxPrice');
        const applyPriceBtn = document.getElementById('applyPrice');
        const resetFiltersBtn = document.getElementById('resetFilters');
        const loadMoreBtn = document.getElementById('loadMore');
        
        let visibleProducts = 8;
        
        // Search Functionality
        if (searchInput) {
            searchInput.addEventListener('input', filterProducts);
        }
        
        // Sort Functionality
        if (sortSelect) {
            sortSelect.addEventListener('change', sortProducts);
        }
        
        // Category Filter
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', filterProducts);
        });
        
        // Stock Filter
        stockCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', filterProducts);
        });
        
        // Price Filter
        if (applyPriceBtn) {
            applyPriceBtn.addEventListener('click', filterProducts);
        }
        
        // Reset Filters
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', resetFilters);
        }
        
        // Load More
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMoreProducts);
        }
        
        function filterProducts() {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const selectedCategories = Array.from(categoryCheckboxes)
                .filter(cb => cb.checked && cb.value !== 'all')
                .map(cb => cb.value.toLowerCase());
            const selectedStock = Array.from(stockCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            
            const minPrice = parseFloat(minPriceInput.value) || 0;
            const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
            
            let visibleCount = 0;
            
            productCards.forEach(card => {
                const name = card.dataset.name;
                const category = card.dataset.category;
                const price = parseFloat(card.dataset.price);
                const stock = parseInt(card.dataset.stock);
                
                // Check search term
                const matchesSearch = !searchTerm || name.includes(searchTerm);
                
                // Check category
                const matchesCategory = selectedCategories.length === 0 || 
                    selectedCategories.includes(category);
                
                // Check stock
                const stockStatus = stock > 0 ? 'in-stock' : 'out-of-stock';
                const matchesStock = selectedStock.length === 0 || 
                    selectedStock.includes(stockStatus);
                
                // Check price
                const matchesPrice = price >= minPrice && price <= maxPrice;
                
                // Show/hide based on all filters
                if (matchesSearch && matchesCategory && matchesStock && matchesPrice) {
                    card.style.display = 'block';
                    visibleCount++;
                    
                    // Show only limited products initially
                    if (visibleCount <= visibleProducts) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show/hide load more button
            if (loadMoreBtn) {
                if (visibleCount > visibleProducts) {
                    loadMoreBtn.style.display = 'block';
                } else {
                    loadMoreBtn.style.display = 'none';
                }
            }
            
            // Show no products message
            showNoProductsMessage(visibleCount === 0);
        }
        
        function sortProducts() {
            const sortValue = sortSelect.value;
            const container = document.getElementById('productsGrid');
            const cards = Array.from(container.querySelectorAll('.shop-card'));
            
            cards.sort((a, b) => {
                const priceA = parseFloat(a.dataset.price);
                const priceB = parseFloat(b.dataset.price);
                const nameA = a.dataset.name;
                const nameB = b.dataset.name;
                
                switch(sortValue) {
                    case 'price-low':
                        return priceA - priceB;
                    case 'price-high':
                        return priceB - priceA;
                    case 'name':
                        return nameA.localeCompare(nameB);
                    default:
                        return 0;
                }
            });
            
            // Re-append sorted cards
            cards.forEach(card => container.appendChild(card));
        }
        
        function resetFilters() {
            // Reset search
            if (searchInput) searchInput.value = '';
            
            // Reset category checkboxes
            categoryCheckboxes.forEach(cb => {
                if (cb.value === 'all') {
                    cb.checked = true;
                } else {
                    cb.checked = false;
                }
            });
            
            // Reset stock checkboxes
            stockCheckboxes.forEach(cb => {
                cb.checked = cb.value === 'in-stock';
            });
            
            // Reset price inputs
            if (minPriceInput) minPriceInput.value = 0;
            if (maxPriceInput) maxPriceInput.value = 5000;
            
            // Reset sort
            if (sortSelect) sortSelect.value = 'default';
            
            // Reset visible products
            visibleProducts = 8;
            
            // Apply filters
            filterProducts();
            
            // Close sidebar on mobile
            if (filtersSidebar) {
                filtersSidebar.classList.remove('active');
            }
            
            showNotification('Filters reset successfully', 'success');
        }
        
        function loadMoreProducts() {
            visibleProducts += 8;
            filterProducts();
            
            // Smooth scroll to show new products
            loadMoreBtn.scrollIntoView({ behavior: 'smooth' });
        }
        
        function showNoProductsMessage(show) {
            let message = document.querySelector('.no-products-found');
            if (show && !message) {
                message = document.createElement('div');
                message.className = 'no-products-found';
                message.innerHTML = `
                    <i class="fas fa-box-open fa-3x"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                `;
                document.getElementById('productsGrid').appendChild(message);
            } else if (!show && message) {
                message.remove();
            }
        }
        
        // Initialize filters
        filterProducts();
    }











        // Cart Page Functionality
    if (window.location.pathname === '/cart/' || window.location.pathname === '/cart') {
        initializeCartPage();
    }
    
    function initializeCartPage() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Update cart display
        updateCartDisplay(cart);
        
        // Clear cart button
        const clearCartBtn = document.getElementById('clearCart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to clear your cart?')) {
                    localStorage.removeItem('cart');
                    updateCartDisplay([]);
                    updateCartCount();
                    showCartNotification('Cart cleared successfully');
                    
                    // Reload page to show empty cart
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                }
            });
        }
        
        // Quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const isPlus = this.classList.contains('plus');
                updateQuantity(productId, isPlus ? 1 : -1);
            });
        });
        
        // Quantity input changes
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const productId = this.getAttribute('data-id');
                const newQuantity = parseInt(this.value);
                
                if (newQuantity > 0 && newQuantity <= 99) {
                    updateQuantity(productId, newQuantity, true);
                } else if (newQuantity > 99) {
                    this.value = 99;
                    updateQuantity(productId, 99, true);
                } else {
                    this.value = 1;
                    updateQuantity(productId, 1, true);
                }
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                removeFromCart(productId);
            });
        });
        
        // Add from empty cart
        document.querySelectorAll('.add-from-empty').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                // Fetch product details and add to cart
                addProductToCart(productId, 1);
            });
        });
        
        // Promo code
        const applyPromoBtn = document.getElementById('applyPromo');
        if (applyPromoBtn) {
            applyPromoBtn.addEventListener('click', function() {
                const promoCode = document.getElementById('promoCode').value;
                if (promoCode.trim()) {
                    showCartNotification('Promo code applied: ' + promoCode);
                } else {
                    showCartNotification('Please enter a promo code');
                }
            });
        }
        
        function updateQuantity(productId, change, setAbsolute = false) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const itemIndex = cart.findIndex(item => item.id === productId);
            
            if (itemIndex !== -1) {
                if (setAbsolute) {
                    cart[itemIndex].quantity = change;
                } else {
                    cart[itemIndex].quantity += change;
                }
                
                // Remove if quantity is 0 or less
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1);
                    showCartNotification('Item removed from cart');
                } else {
                    // Limit to 99
                    if (cart[itemIndex].quantity > 99) {
                        cart[itemIndex].quantity = 99;
                        showCartNotification('Maximum quantity is 99');
                    }
                }
                
                // Save and update
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay(cart);
                updateCartCount();
                
                // Send update to server if needed
                sendCartUpdateToServer(cart);
            }
        }
        
        function removeFromCart(productId) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(item => item.id !== productId);
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay(cart);
            updateCartCount();
            showCartNotification('Item removed from cart');
            
            // Send update to server if needed
            sendCartUpdateToServer(cart);
        }
        
        function addProductToCart(productId, quantity) {
            // This would fetch product details from server
            // For now, add with basic info
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: productId,
                    quantity: quantity,
                    name: 'Product ' + productId, // Would be fetched from server
                    price: '0.00' // Would be fetched from server
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay(cart);
            updateCartCount();
            showCartNotification('Product added to cart');
        }
        
        function updateCartDisplay(cart) {
            // Update the cart items list
            const cartItemsList = document.getElementById('cartItemsList');
            if (cartItemsList && cart.length > 0) {
                // You would update the entire cart display here
                // For now, we'll just update totals
                updateCartTotals(cart);
            }
        }
        
        function updateCartTotals(cart) {
            // Calculate totals
            let subtotal = 0;
            let totalItems = 0;
            
            cart.forEach(item => {
                // In real app, get price from item data
                const price = parseFloat(item.price || 0);
                const quantity = parseInt(item.quantity);
                subtotal += price * quantity;
                totalItems += quantity;
            });
            
            // Update UI elements
            const subtotalElements = document.querySelectorAll('.subtotal');
            const totalItemsElements = document.querySelectorAll('.total-items');
            const grandTotalElements = document.querySelectorAll('.total-amount');
            
            subtotalElements.forEach(el => {
                el.textContent = '৳' + subtotal.toFixed(2);
            });
            
            totalItemsElements.forEach(el => {
                el.textContent = totalItems;
            });
            
            // Calculate shipping
            const shipping = subtotal >= 2000 ? 0 : 100;
            const shippingElements = document.querySelectorAll('.shipping');
            shippingElements.forEach(el => {
                el.textContent = shipping === 0 ? 'FREE' : '৳' + shipping;
            });
            
            // Calculate grand total
            const grandTotal = subtotal + shipping;
            grandTotalElements.forEach(el => {
                el.textContent = '৳' + grandTotal.toFixed(2);
            });
        }
        
        function sendCartUpdateToServer(cart) {
            // Send cart data to server for processing
            fetch('/update-cart/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                body: JSON.stringify({ cart: cart })
            })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    console.error('Failed to update cart on server');
                }
            })
            .catch(error => {
                console.error('Error updating cart:', error);
            });
        }
        
        function showCartNotification(message) {
            const notification = document.getElementById('cartNotification');
            const messageEl = document.getElementById('notificationMessage');
            
            if (notification && messageEl) {
                messageEl.textContent = message;
                notification.style.display = 'block';
                
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 3000);
            } else {
                showNotification(message, 'success');
            }
        }
    }
    
    function getCSRFToken() {
        const name = 'csrftoken';
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }











    // Checkout Page Functionality
    if (window.location.pathname === '/checkout/' || window.location.pathname === '/checkout') {
        initializeCheckoutPage();
    }
    
    function initializeCheckoutPage() {
        const checkoutForm = document.getElementById('checkoutForm');
        const orderSuccessModal = document.getElementById('orderSuccessModal');
        
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', handleCheckoutSubmit);
        }
        
        // Download Invoice Button
        const downloadInvoiceBtn = document.getElementById('downloadInvoice');
        if (downloadInvoiceBtn) {
            downloadInvoiceBtn.addEventListener('click', downloadInvoice);
        }
        
        // Form validation
        setupFormValidation();
    }
    
    function setupFormValidation() {
        const form = document.getElementById('checkoutForm');
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
        });
        
        // Phone number validation
        const phoneInput = document.getElementById('phoneNumber');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '');
                if (this.value.length > 11) {
                    this.value = this.value.slice(0, 11);
                }
            });
        }
    }
    
    function validateField(e) {
        const field = e.target;
        const errorId = field.id + 'Error';
        const errorElement = document.getElementById(errorId);
        
        let isValid = true;
        let errorMessage = '';
        
        // Check if empty
        if (!field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        // Specific validations
        else if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        else if (field.id === 'phoneNumber') {
            const phoneRegex = /^01[3-9]\d{8}$/;
            if (!phoneRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid Bangladesh phone number (01XXXXXXXXX)';
            }
        }
        
        if (errorElement) {
            if (!isValid) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
                field.style.borderColor = '#cc0000';
            } else {
                errorElement.style.display = 'none';
                field.style.borderColor = '#00aa00';
            }
        }
        
        return isValid;
    }
    
    function clearError(e) {
        const field = e.target;
        const errorId = field.id + 'Error';
        const errorElement = document.getElementById(errorId);
        
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        field.style.borderColor = 'var(--black)';
    }
    
    function validateForm() {
        const form = document.getElementById('checkoutForm');
        const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            const event = new Event('blur');
            field.dispatchEvent(event);
            
            const errorId = field.id + 'Error';
            const errorElement = document.getElementById(errorId);
            
            if (errorElement && errorElement.style.display === 'block') {
                isValid = false;
            }
        });
        
        // Check terms agreement
        const termsCheckbox = document.getElementById('terms');
        const termsError = document.getElementById('termsError');
        
        if (termsCheckbox && !termsCheckbox.checked) {
            isValid = false;
            if (termsError) {
                termsError.textContent = 'You must agree to the terms and conditions';
                termsError.style.display = 'block';
            }
        } else if (termsError) {
            termsError.style.display = 'none';
        }
        
        return isValid;
    }
    
    async function handleCheckoutSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showNotification('Please fix the errors in the form', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Get cart data
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Show loading state
        const submitBtn = e.target.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PROCESSING ORDER...';
        submitBtn.disabled = true;
        
        try {
            // Send order data to server
            const response = await fetch('/process-checkout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                body: JSON.stringify({
                    cart: cart,
                    form_data: data
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Show success modal
                showOrderSuccessModal(data, result.order_id);
                
                // Clear cart
                localStorage.removeItem('cart');
                updateCartCount();
                
                // Update modal with order details
                document.getElementById('modalCustomerName').textContent = data.full_name;
                document.getElementById('modalPhoneNumber').textContent = data.phone_number;
                document.getElementById('trackingOrderId').textContent = result.order_id;
                document.getElementById('modalOrderId').textContent = result.order_id;
                
            } else {
                showNotification(result.error || 'Order failed. Please try again.', 'error');
            }
            
        } catch (error) {
            console.error('Checkout error:', error);
            showNotification('Network error. Please check your connection.', 'error');
            
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    function showOrderSuccessModal(formData, orderId) {
        const modal = document.getElementById('orderSuccessModal');
        
        if (modal) {
            // Fill modal with data
            document.getElementById('modalCustomerName').textContent = formData.full_name || '';
            document.getElementById('modalPhone').textContent = formData.phone_number || '';
            document.getElementById('modalPhoneNumber').textContent = formData.phone_number || '';
            document.getElementById('modalOrderId').textContent = orderId;
            document.getElementById('trackingOrderId').textContent = orderId;
            
            // Show modal
            modal.style.display = 'block';
            
            // Close modal when clicking outside
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }
    
    function downloadInvoice() {
        // This would generate and download PDF invoice
        // For now, show a message
        showNotification('Invoice download feature will be implemented soon!', 'success');
        
        // In production, this would call a Django view that generates PDF
        // window.open('/download-invoice/' + orderId, '_blank');
    }



















    function initializeCartPage() {
        // Load cart from localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // If cart is empty, show empty cart message
        if (cart.length === 0) {
            showEmptyCart();
            return;
        }
        
        // Send cart data to server to get full product details
        fetchCartDetails(cart);
        
        // Setup event listeners
        setupCartEventListeners();
    }
    
    async function fetchCartDetails(cart) {
        try {
            // Convert cart to URL parameters
            const cartParam = encodeURIComponent(JSON.stringify(cart));
            
            // Fetch cart page with cart data
            const response = await fetch(`/cart/?cart=${cartParam}`);
            const html = await response.text();
            
            // Parse the HTML response
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract cart items HTML
            const cartItemsSection = doc.querySelector('.cart-items-section');
            const orderSummarySection = doc.querySelector('.order-summary-section');
            
            if (cartItemsSection) {
                // Update cart items
                document.querySelector('.cart-items-section').innerHTML = cartItemsSection.innerHTML;
            }
            
            if (orderSummarySection) {
                // Update order summary
                document.querySelector('.order-summary-section').innerHTML = orderSummarySection.innerHTML;
            }
            
            // Re-attach event listeners to new elements
            setupCartEventListeners();
            
        } catch (error) {
            console.error('Error fetching cart details:', error);
            showNotification('Error loading cart. Please refresh the page.', 'error');
        }
    }
    
    function setupCartEventListeners() {
        // Clear cart button
        const clearCartBtn = document.getElementById('clearCart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to clear your cart?')) {
                    localStorage.removeItem('cart');
                    updateCartCount();
                    showCartNotification('Cart cleared successfully');
                    location.reload();
                }
            });
        }
        
        // Quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const isPlus = this.classList.contains('plus');
                updateCartQuantity(productId, isPlus ? 1 : -1);
            });
        });
        
        // Quantity input changes
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const productId = this.getAttribute('data-id');
                const newQuantity = parseInt(this.value);
                
                if (newQuantity > 0 && newQuantity <= 99) {
                    updateCartQuantity(productId, newQuantity, true);
                } else if (newQuantity > 99) {
                    this.value = 99;
                    updateCartQuantity(productId, 99, true);
                } else {
                    this.value = 1;
                    updateCartQuantity(productId, 1, true);
                }
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                removeFromCart(productId);
            });
        });
        
        // Add from empty cart
        document.querySelectorAll('.add-from-empty').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                addToCartFromProductId(productId, 1);
            });
        });
    }
    
    function updateCartQuantity(productId, change, setAbsolute = false) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            if (setAbsolute) {
                cart[itemIndex].quantity = change;
            } else {
                cart[itemIndex].quantity += change;
            }
            
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
                showCartNotification('Item removed from cart');
            } else if (cart[itemIndex].quantity > 99) {
                cart[itemIndex].quantity = 99;
                showCartNotification('Maximum quantity is 99');
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Reload cart page with updated data
            fetchCartDetails(cart);
        }
    }
    
    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showCartNotification('Item removed from cart');
        
        // Reload cart page
        if (cart.length === 0) {
            location.reload();
        } else {
            fetchCartDetails(cart);
        }
    }
    
    async function addToCartFromProductId(productId, quantity) {
        try {
            // Fetch product details
            const response = await fetch(`/get-product/${productId}/`);
            const product = await response.json();
            
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: productId,
                    quantity: quantity
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            showCartNotification('Product added to cart');
            
            // Reload cart page
            fetchCartDetails(cart);
            
        } catch (error) {
            console.error('Error adding product to cart:', error);
            showNotification('Error adding product to cart', 'error');
        }
    }
    
    function showEmptyCart() {
        // Show empty cart message
        const cartContainer = document.querySelector('.cart-container');
        if (cartContainer) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h2>YOUR CART IS EMPTY</h2>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <a href="/shop/" class="btn btn-blue">
                        <i class="fas fa-shopping-bag"></i> START SHOPPING
                    </a>
                </div>
            `;
        }
    }