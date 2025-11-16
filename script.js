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


/* ======== 
  NEW GOOGLE ADDRESS AUTOCOMPLETE FUNCTION 
  This function is called by the script tag in the HTML.
======== */

function initAutocomplete() {
    // Find the input element by its ID
    const addressInput = document.getElementById('address-input');
    
    if (addressInput) {
        // Create the autocomplete object
        const autocomplete = new google.maps.places.Autocomplete(addressInput, {
            types: ['address'], // Only search for street addresses
            componentRestrictions: { 'country': 'in' } // Restrict search to India
        });

        // Add a listener for when an address is selected
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            console.log("Selected place:", place);

            // OPTIONAL: Auto-fill City and Pincode
            // This is more complex, as you need to loop through address components
            let city = '';
            let pincode = '';

            for (const component of place.address_components) {
                const componentType = component.types[0];

                if (componentType === 'locality') {
                    city = component.long_name;
                }
                
                if (componentType === 'postal_code') {
                    pincode = component.long_name;
                }
            }

            if (document.getElementById('city')) {
                document.getElementById('city').value = city;
            }
            if (document.getElementById('pincode')) {
                document.getElementById('pincode').value = pincode;
            }
            
        });
    }
}
