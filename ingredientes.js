document.addEventListener('DOMContentLoaded', function() {
    // Select all buttons EXCEPT the one with the 'savebutton' class
    const buttons = document.querySelectorAll('button:not(.savebutton)'); 
    const inputs = document.querySelectorAll('.inputbox');
    const saveButton = document.querySelector('.savebutton'); // Select the save button

    // --- BUTTONS FUNCTIONALITY (Existing) ---
    
    // Function to load button states from local storage
    function loadButtonStates() {
        buttons.forEach(button => {
            const buttonName = button.textContent;
            const savedState = localStorage.getItem('button_' + buttonName);
            if (savedState === 'green') {
                button.style.backgroundColor = 'rgb(29, 255, 29)';
                button.style.color = 'white';
            } else {
                // Ensure buttons revert to their original state if not saved as green
                button.style.backgroundColor = '';
                button.style.color = '';
            }
        });
    }

    // Function to save button state to local storage
    function saveButtonState(button, state) {
        const buttonName = button.textContent;
        if (state === 'green') {
            localStorage.setItem('button_' + buttonName, 'green');
        } else {
            localStorage.removeItem('button_' + buttonName);
        }
    }

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle between the original color and green
            const isGreen = this.style.backgroundColor === 'rgb(29, 255, 29)';
            
            if (isGreen) {
                this.style.backgroundColor = '';
                this.style.color = '';
                saveButtonState(this, 'original');
            } else {
                this.style.backgroundColor = 'rgb(29, 255, 29)';
                this.style.color = 'white';
                saveButtonState(this, 'green');
            }
        });
    });

    // --- INPUTS FUNCTIONALITY (Existing) ---

    // Function to load input values from local storage
    function loadInputValues() {
        inputs.forEach(input => {
            const savedValue = localStorage.getItem('input_' + input.id);
            if (savedValue !== null) {
                input.value = savedValue;
            }
        });
    }

    // Function to save input value to local storage
    function saveInputValue(input) {
        localStorage.setItem('input_' + input.id, input.value);
    }

    inputs.forEach(input => {
        input.addEventListener('input', function() {
            saveInputValue(this);
        });
    });

    // --- PDF GENERATION FUNCTIONALITY (New) ---

    if (saveButton) { // Ensure the save button exists before adding listener
        saveButton.addEventListener('click', function() {
            // Target the entire HTML document for PDF conversion
            const element = document.documentElement; // Changed from document.body to document.documentElement

            // Optional: Add a temporary visual feedback to the user
            this.textContent = 'Saving PDF...';
            this.disabled = true; // Disable button during saving

            // Generate PDF
            html2pdf(element, {
                margin: 10,
                filename: 'stock_report.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    useCORS: true, 
                    logging: true, // Enable logging for debugging html2canvas
                    scrollY: 0,    // Ensure rendering starts from the top of the element
                    windowWidth: document.documentElement.scrollWidth,  // Capture full width
                    windowHeight: document.documentElement.scrollHeight // Capture full height
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }).then(() => {
                console.log('PDF generation complete!'); 
                // Revert button text and enable after PDF is generated/downloaded
                this.innerHTML = '&#x1F4BE;'; // Revert to original icon
                this.disabled = false;
            }).catch(error => {
                console.error('Error generating PDF:', error);
                this.innerHTML = 'Error! Try Again'; // Show error message
                this.disabled = false;
            });
        });
    }


    // Load states and values when the page is loaded (Existing)
    loadButtonStates();
    loadInputValues();
});
