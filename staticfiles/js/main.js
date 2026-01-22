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