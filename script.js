document.addEventListener("DOMContentLoaded", function() {
    
    // --- Hamburger Menu ---
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle) {
        menuToggle.addEventListener("click", function() {
            navMenu.classList.toggle("open");
        });
    }

    // --- SHOPPING CART LOGIC ---

    // Cart Modal Elements
    const cartModal = document.getElementById("cart-modal");
    const openCartBtn = document.getElementById("open-cart-btn");
    const closeCartBtn = document.getElementById("close-cart-btn");
    const cartItemsContainer = document.getElementById("cart-items-container");
    const cartTotalPriceEl = document.getElementById("cart-total-price");
    const cartItemCountEl = document.getElementById("cart-item-count");
    
    // Order Form Elements
    const orderForm = document.getElementById("orderForm");
    const whatsappBtn = document.getElementById("whatsapp-order-btn");
    const formContainer = document.getElementById("order-form-container");
    const thankYouMessage = document.getElementById("thank-you-message");

    // Cart state
    let cart = {}; // Example: { p1: { name: '...', price: 190, quantity: 2 }, ... }

    // Open Cart Modal
    if (openCartBtn) {
        openCartBtn.addEventListener("click", () => {
            updateCartModal();
            cartModal.style.display = "block";
        });
    }

    // Close Cart Modal
    if (closeCartBtn) {
        closeCartBtn.addEventListener("click", () => {
            cartModal.style.display = "none";
        });
    }

    // Close Modal if clicking outside of it
    window.addEventListener("click", (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = "none";
        }
    });

    // Main function to update cart quantities
    window.changeQuantity = function(productId, amount, productName, productPrice) {
        // Initialize product in cart if it doesn't exist
        if (!cart[productId] && amount > 0) {
            cart[productId] = { name: productName, price: productPrice, quantity: 0 };
        }

        // Update quantity
        if (cart[productId]) {
            cart[productId].quantity += amount;

            // Remove from cart if quantity reaches 0
            if (cart[productId].quantity <= 0) {
                delete cart[productId];
            }
        }
        
        // TIER 2: Add to Cart "Jiggle" Confirmation
        if (amount > 0) {
            openCartBtn.classList.add('jiggle');
            setTimeout(() => {
                openCartBtn.classList.remove('jiggle');
            }, 500); // 500ms matches the CSS animation
        }

        // Update the quantity display on the product card
        const quantityInput = document.getElementById(`quantity-${productId}`);
        if (quantityInput) {
            quantityInput.value = cart[productId] ? cart[productId].quantity : 0;
        }

        // Update cart total count in header
        updateCartCount();
    }

    // Function to update the cart count bubble in the header
    function updateCartCount() {
        let totalCount = 0;
        for (let id in cart) {
            totalCount += cart[id].quantity;
        }
        cartItemCountEl.textContent = totalCount;
    }

    // Function to redraw the cart modal
    function updateCartModal() {
        // Clear previous items
        cartItemsContainer.innerHTML = "";
        let total = 0;

        // Reset form and thank you message
        formContainer.style.display = "none";
        thankYouMessage.style.display = "none";
        
        // Reset submit button in case it was in "Sending..." state
        const submitBtn = orderForm.querySelector("button[type='submit']");
        submitBtn.textContent = "Submit Order";
        submitBtn.disabled = false;

        if (Object.keys(cart).length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        } else {
            formContainer.style.display = "block"; // Show form
            for (let id in cart) {
                const item = cart[id];
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                // Create HTML for each cart item
                const itemEl = document.createElement("div");
                itemEl.className = "cart-item";
                itemEl.innerHTML = `
                    <div class="cart-item-info">
                        <strong>${item.name}</strong> (x ${item.quantity})
                    </div>
                    <div class="cart-item-price">
                        ₹${itemTotal.toFixed(2)}
                    </div>
                `;
                cartItemsContainer.appendChild(itemEl);
            }
        }

        // Update total price
        cartTotalPriceEl.textContent = `₹${total.toFixed(2)}`;
        updateWhatsAppLink();
    }

    // Function to generate the WhatsApp order message
    function updateWhatsAppLink() {
        let message = "Hi! I'd like to place an order:\n";
        let total = 0;

        for (let id in cart) {
            const item = cart[id];
            message += `\n* ${item.name} (x ${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`;
            total += item.price * item.quantity;
        }
        
        message += `\n\n*Total:* ₹${total.toFixed(2)}`;
        
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const address = document.getElementById("address").value;
        const notes = document.getElementById("notes").value; // Get notes

        if (name || phone || address || notes) {
            message += `\n\n*My Details:*`;
            if (name) message += `\nName: ${name}`;
            if (phone) message += `\nPhone: ${phone}`;
            if (address) message += `\nAddress: ${address}`;
            if (notes) message += `\nNotes: ${notes}`; // Add notes
        }
        
        const whatsappUrl = `https://wa.me/919952532391?text=${encodeURIComponent(message)}`;
        whatsappBtn.href = whatsappUrl;
    }
    
    // Add event listeners for all form fields
    document.getElementById("name").addEventListener('input', updateWhatsAppLink);
    document.getElementById("phone").addEventListener('input', updateWhatsAppLink);
    document.getElementById("address").addEventListener('input', updateWhatsAppLink);
    document.getElementById("notes").addEventListener('input', updateWhatsAppLink);


    // Handle the "Submit Order" (email) button
    if (orderForm) {
        orderForm.addEventListener("submit", function(event) {
            event.preventDefault(); 

            let cartString = "";
            let total = 0;
            for (let id in cart) {
                const item = cart[id];
                cartString += `${item.name} (x ${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}\n`;
                total += item.price * item.quantity;
            }
            cartString += `\nTotal: ₹${total.toFixed(2)}`;
            
            document.getElementById("cart-contents").value = cartString;

            const formData = new FormData(orderForm);
            const submitBtn = orderForm.querySelector("button[type='submit']");
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;

            fetch(orderForm.action, {
                method: "POST",
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    formContainer.style.display = "none";
                    thankYouMessage.style.display = "block";
                    cart = {};
                    updateCartCount();
                    document.querySelectorAll('.quantity-controls input').forEach(input => input.value = 0);
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            alert("Oops! There was a problem submitting your form.");
                        }
                        submitBtn.textContent = "Submit Order";
                        submitBtn.disabled = false;
                    });
                }
            }).catch(error => {
                alert("Oops! There was a network error.");
                submitBtn.textContent = "Submit Order";
                submitBtn.disabled = false;
            });
        });
    }

    // --- LIGHTBOX GALLERY LOGIC ---

    const lightboxModal = document.getElementById("lightbox-modal");
    const lightboxImage = document.getElementById("lightbox-image");
    const closeLightboxBtn = document.getElementById("lightbox-close");
    const prevBtn = document.getElementById("lightbox-prev");
    const nextBtn = document.getElementById("lightbox-next");

    // Galleries based on your last request
    const galleries = [
        ['2.png', '3.png'], // Gallery for Product 1 (Nourish)
        ['3.png', '4.png'], // Gallery for Product 2 (Anti-Grey)
        ['4.png', '5.png']  // Gallery for Product 3 (Combo)
    ];

    let currentGalleryIndex = 0;
    let currentImageIndex = 0;

    // Function to open the lightbox
    window.openLightbox = function(galleryIdx, imageIdx) {
        currentGalleryIndex = galleryIdx;
        currentImageIndex = imageIdx;
        updateLightboxImage();
        lightboxModal.style.display = "flex";
    }

    // Function to update the image source
    function updateLightboxImage() {
        const imagePath = galleries[currentGalleryIndex][currentImageIndex];
        lightboxImage.src = imagePath;
    }

    // Function to show the next image
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleries[currentGalleryIndex].length;
        updateLightboxImage();
    }

    // Function to show the previous image
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleries[currentGalleryIndex].length) % galleries[currentGalleryIndex].length;
        updateLightboxImage();
    }

    // Event Listeners for lightbox
    if (lightboxModal) {
        closeLightboxBtn.addEventListener("click", () => lightboxModal.style.display = "none");
        nextBtn.addEventListener("click", showNextImage);
        prevBtn.addEventListener("click", showPrevImage);
    }
    
    // --- FAQ ACCORDION LOGIC ---
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            
            // Check if the item is already active
            const isActive = faqItem.classList.contains('active');
            
            // Close all other open items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // If it wasn't active, open it
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

});
