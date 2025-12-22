// utils/cartUpdate.js

// Function to update cart and trigger header update
export function updateCartAndNotify(action, productData) {
  // Update localStorage
  let cart = JSON.parse(localStorage.getItem('shopping_cart') || '[]')
  
  switch(action) {
    case 'add':
      const existingIndex = cart.findIndex(item => item.id === productData.id)
      if (existingIndex > -1) {
        cart[existingIndex].quantity += productData.quantity || 1
      } else {
        cart.push({
          ...productData,
          quantity: productData.quantity || 1
        })
      }
      break
      
    case 'remove':
      cart = cart.filter(item => item.id !== productData.id)
      break
      
    case 'update':
      const itemIndex = cart.findIndex(item => item.id === productData.id)
      if (itemIndex > -1) {
        cart[itemIndex].quantity = productData.quantity
      }
      break
      
    case 'clear':
      cart = []
      break
  }
  
  // Save to localStorage
  localStorage.setItem('shopping_cart', JSON.stringify(cart))
  
  // Update timestamp for cross-tab sync
  localStorage.setItem('cart-last-updated', Date.now().toString())
  
  // Dispatch custom event for real-time updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cart-updated'))
    
    // Also call the global update function if available
    if (window.updateHeaderCartCount) {
      window.updateHeaderCartCount()
    }
  }
  
  console.log(`Cart ${action} completed:`, cart.length, 'items')
  return cart
}

// Function to add to cart with notification
export function addToCartWithNotification(product, quantity = 1) {
  const cartProduct = {
    id: product.id || product.productId,
    name: product.name,
    price: product.price || product.unitPrice,
    image: product.primaryImage || product.images?.[0]?.imageUrl || '/assets/images/thumbs/default-product.png',
    quantity: quantity,
    color: product.color,
    size: product.size,
    stock: product.stock,
    tags: product.tags || []
  }
  
  updateCartAndNotify('add', cartProduct)
  showCartNotification(product.name, quantity)
}

// Function to show cart notification
function showCartNotification(productName, quantity) {
  // Create notification
  const notification = document.createElement('div')
  notification.className = 'cart-notification'
  notification.innerHTML = `
    <div class="notification-content">
      <i class="ph ph-check-circle text-green-500 text-lg"></i>
      <div>
        <strong>Added to Cart!</strong>
        <div class="text-sm">${quantity}x ${productName}</div>
      </div>
    </div>
    <button class="view-cart-btn" onclick="window.location.href='/product/cart'">
      View Cart
    </button>
  `
  
  // Add styles
  const style = document.createElement('style')
  style.textContent = `
    .cart-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      z-index: 999999;
      animation: slideInRight 0.3s ease;
      max-width: 400px;
      border-left: 4px solid #10b981;
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }
    
    .view-cart-btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .view-cart-btn:hover {
      background: #2563eb;
    }
    
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `
  
  document.head.appendChild(style)
  document.body.appendChild(notification)
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease'
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification)
      }
      if (style.parentNode) {
        document.head.removeChild(style)
      }
    }, 300)
  }, 4000)
  
  // Remove on click
  notification.addEventListener('click', (e) => {
    if (!e.target.closest('.view-cart-btn')) {
      notification.style.animation = 'slideOutRight 0.3s ease'
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification)
        }
        if (style.parentNode) {
          document.head.removeChild(style)
        }
      }, 300)
    }
  })
}