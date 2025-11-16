document.addEventListener("DOMContentLoaded", function() {
    
    // --- NEW: Hamburger Menu ---
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle) {
        menuToggle.addEventListener("click", function() {
            navMenu.classList.toggle("open");
        });
    }

    // --- OLD: Order Form Calculator ---
    // We check if these elements exist before adding listeners
    // This stops errors on the homepage (where there is no form)
    const product1 = document.getElementById("product1");
    const product2 = document.getElementById("product2");
    const product3 = document.getElementById("product3");
    const totalAmountSpan = document.getElementById("totalAmount");

    // Create a function to calculate the total
    function calculateTotal() {
        let total = 0;
        
        if (product1.checked) {
            total += parseInt(product1.value);
        }
        if (product2.checked) {
            total += parseInt(product2.value);
        }
        if (product3.checked) {
            total += parseInt(product3.value);
        }
        
        // Update the total amount on the page
        if (totalAmountSpan) {
            totalAmountSpan.textContent = total;
        }
    }

    // Add event listeners only if the elements exist
    if (product1) {
        product1.addEventListener("change", calculateTotal);
    }
    if (product2) {
        product2.addEventListener("change", calculateTotal);
    }
    if (product3) {
        product3.addEventListener("change", calculateTotal);
    }

});
