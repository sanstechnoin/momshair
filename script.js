/* ========
   GLOBAL STATE
======== */
let cart = {};
const WHATSAPP_NUMBER = "919952532391"; // Your WhatsApp number

// Define product images for lightbox
const lightboxImages = [
    ["2.png", "3.png"], // Product 0 (Nourish)
    ["3.png", "4.png"], // Product 1 (Anti-Grey)
    ["4.png", "5.png"]  // Product 2 (Combo)
];
let currentLightboxProduct = 0;
let currentLightboxImage = 0;


/* ========
   RUNS WHEN PAGE LOADS
======== */
document.addEventListener("DOMContentLoaded", () => {
    
    // Mobile Menu
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-question');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const parent = item.parentElement;
            parent.classList.toggle('active');
        });
    });

    // Cart Modal
    const cartModal = document.getElementById('cart-modal');
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    openCartBtn.addEventListener('click', () => cartModal.style.display = 'block');
    closeCartBtn.addEventListener('click', () => cartModal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Lightbox Modal
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    lightboxClose.addEventListener('click', () => lightboxModal.style.display = 'none');
    lightboxPrev.addEventListener('click', () => showLightboxImage(-1));
    lightboxNext.addEventListener('click', () => showLightboxImage(1));

    // Formspree Thank You
    const orderForm = document.getElementById('orderForm');
    orderForm.addEventListener('submit', handleFormSubmit);
});

/* ========
   CART LOGIC
======== */
function changeQuantity(productId, amount, productName, price) {
    // Initialize product in cart if it doesn't exist
    if (!cart[productId] && amount > 0) {
        cart[productId] = {
            name: productName,
            price: price,
            quantity: 0
        };
    }

    // Update quantity
    if (cart[productId]) {
        cart[productId].quantity += amount;

        // Remove from cart if quantity is 0 or less
        if (cart[productId].quantity <= 0) {
            delete cart[productId];
        }
    }

    // Update the UI
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const cartItemCountEl = document.getElementById('cart-item-count');
    const cartContentsInput = document.getElementById('cart-contents');
    const whatsappBtn = document.getElementById('whatsapp-order-btn');

    cartItemsContainer.innerHTML = ''; // Clear cart
    let totalPrice = 0;
    let totalCount = 0;
    let cartStringForForm = "";
    let whatsappMessage = "Hi! I'd like to order:\n";

    if (Object.keys(cart).length === 0) {
        cartItemsContainer.innerHTML = '<p style="padding: 1rem 0; color: #777;">Your cart is empty.</p>';
    }

    for (const productId in cart) {
        const item = cart[productId];
        totalPrice += item.price * item.quantity;
        totalCount += item.quantity;

        // Create cart item HTML
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-details">
                <strong>${item.name}</strong> (x ${item.quantity})
            </div>
            <div class="cart-item-price">
                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                <span class="cart-item-remove" onclick="changeQuantity('${productId}', -${item.quantity})">×</span>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);

        // Update strings for form/WhatsApp
        const itemString = `${item.name} (x ${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}\n`;
        cartStringForForm += itemString;
        whatsappMessage += itemString;
    }

    // Update totals
    cartTotalPriceEl.innerText = `₹${totalPrice.toFixed(2)}`;
    cartItemCountEl.innerText = totalCount;

    // Update hidden input for Formspree
    cartStringForForm += `\nTOTAL: ₹${totalPrice.toFixed(2)}`;
    cartContentsInput.value = cartStringForForm;

    // Update WhatsApp button link
    whatsappMessage += `\n*Total: ₹${totalPrice.toFixed(2)}*`;
    whatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
}

// Formspree success handler
function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);

    fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            // Show thank you message
            document.getElementById('order-form-container').style.display = 'none';
            document.getElementById('thank-you-message').style.display = 'block';
            
            // Clear cart
            cart = {};
            updateCartUI();
        } else {
            alert('There was a problem submitting your order. Please try again or use WhatsApp.');
        }
    }).catch(error => {
        alert('There was a problem submitting your order. Please try again or use WhatsApp.');
    });
}

/* ========
   LIGHTBOX LOGIC
======== */
function openLightbox(productIndex, imageIndex) {
    currentLightboxProduct = productIndex;
    currentLightboxImage = imageIndex;
    
    const imagePath = lightboxImages[currentLightboxProduct][currentLightboxImage];
    document.getElementById('lightbox-image').src = imagePath;
    document.getElementById('lightbox-modal').style.display = 'flex';
}

function showLightboxImage(direction) {
    const imageArray = lightboxImages[currentLightboxProduct];
    currentLightboxImage += direction;

    // Loop back
    if (currentLightboxImage < 0) {
        currentLightboxImage = imageArray.length - 1;
    }
    if (currentLightboxImage >= imageArray.length) {
        currentLightboxImage = 0;
    }
    
    document.getElementById('lightbox-image').src = imageArray[currentLightboxImage];
}

/* ========
   GOOGLE MAPS AUTOCOMPLETE
   (Must be global)
======== */
function initAutocomplete() {
    const addressInput = document.getElementById('address');
    
    if (addressInput) {
        const autocomplete = new google.maps.places.Autocomplete(addressInput, {
            types: ['address'],
            componentRestrictions: { 'country': 'in' }
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            console.log("Selected place:", place.formatted_address);
        });
    }
}
