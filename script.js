document.addEventListener("DOMContentLoaded", function() {
    
    // Get references to the checkboxes and the total amount span
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
        totalAmountSpan.textContent = total;
    }

    // Add event listeners to each checkbox
    product1.addEventListener("change", calculateTotal);
    product2.addEventListener("change", calculateTotal);
    product3.addEventListener("change", calculateTotal);

});