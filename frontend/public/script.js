document.addEventListener('DOMContentLoaded', function() {
    let allContactos = []; // Store full contact data here {id: '...', fields: {...}}
    let clientTomSelect = null; // Variable to hold the Tom Select instance

    const clientSelectElement = document.getElementById('client'); // Get the new select element
    const discountHint = document.getElementById('client-discount-hint');
    const salesForm = document.getElementById('sales-form');
    const reviewModal = document.getElementById('review-modal');
    const successModal = document.getElementById('success-modal');
    const documentNumberContainer = document.getElementById('document-number-container');
    const comments = document.getElementById('comments');
    const charCount = document.getElementById('char-count');

    // Initialize flatpickr
    const saleDateInstance = flatpickr("#sale-date", {
       dateFormat: "d/m/Y",
       locale: "es",
       defaultDate: new Date()
    });

    // Fetch vendors
    fetch('/api/vendors')
      .then(response => response.json())
      .then(vendors => {
         const select = document.getElementById('salesperson');
          select.innerHTML = '<option value="" disabled selected>Seleccione un vendedor</option>';
          vendors.forEach(vendor => {
            if (vendor.fields && vendor.fields.Persona) {
              const option = document.createElement('option');
              option.value = vendor.id; // Airtable Record ID
              option.textContent = vendor.fields.Persona;
              select.appendChild(option);
            }
          });
      })
      .catch(err => console.error('Error fetching vendors:', err));

    // Fetch Contactos and initialize Tom Select
    fetch('/api/contactos')
      .then(response => {
           if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
           return response.json();
       })
      .then(contactos => {
        allContactos = contactos; // Store the full data

        // Prepare options for Tom Select
        const clientOptions = contactos.map(contacto => {
          if (contacto.fields && contacto.fields.Nombre) {
            return {
              value: contacto.id, // Use Airtable Record ID as the value
              text: contacto.fields.Nombre // Use Name for display and search
            };
          }
          return null; // Handle cases where data might be missing
        }).filter(option => option !== null); // Remove any null entries

        // Initialize Tom Select
        clientTomSelect = new TomSelect(clientSelectElement, {
          options: clientOptions,
          searchField: ['text'], // Search by the 'text' property (client name)
          placeholder: 'Buscar o seleccionar cliente...',
          create: false, // Don't allow creating new clients from the input
          allowEmptyOption: true, // Allows clearing the selection
          // Add the custom class for the icon AFTER initialization
          onInitialize: function() {
            this.control.classList.add('wine-bottle-icon');
          },
          // Add listener for selection changes
          onChange: function(selectedClientId) {
            updateDiscountHint(selectedClientId); // Call function to update hint
          }
        });
      })
      .catch(err => console.error('Error fetching contactos or initializing Tom Select:', err));

    // Function to update the discount hint based on selected client ID
    function updateDiscountHint(clientId) {
      if (!clientId) {
        discountHint.classList.add('hidden');
        discountHint.textContent = '';
        return;
      }

      const matchedContacto = allContactos.find(c => c.id === clientId);

      if (matchedContacto && matchedContacto.fields) {
        const descuentoB2B = matchedContacto.fields['Descuento por Club o B2B'];
        const esClub = matchedContacto.fields['Club'];

        let hintText = '';
        if (descuentoB2B !== undefined && descuentoB2B !== null && descuentoB2B > 0) {
          hintText += `Sugerencia B2B: ${descuentoB2B}%`;
        }
        if (esClub) {
          hintText += (hintText ? ' / ' : 'Sugerencia: ') + 'Es Club';
        }

        if (hintText) {
          discountHint.textContent = hintText;
          discountHint.classList.remove('hidden');
        } else {
          discountHint.classList.add('hidden');
        }
      } else {
        discountHint.classList.add('hidden');
      }
    }


    // Show/hide document number field based on SII selection
     const documentRadios = document.querySelectorAll('input[name="document-type"]');
     documentRadios.forEach(radio => {
       radio.addEventListener('change', function() {
         documentNumberContainer.classList.toggle('hidden', this.value !== 'boleta' && this.value !== 'factura');
       });
     });

    // Character count for comments
     comments.addEventListener('input', function() {
       charCount.textContent = this.value.length;
     });

    // Form submission for review
    salesForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const salespersonSelect = document.getElementById('salesperson');
      const selectedClientId = clientTomSelect.getValue(); // Get selected client ID from Tom Select
      const selectedClientOption = clientTomSelect.options[selectedClientId]; // Get the full option object
      const clientName = selectedClientOption ? selectedClientOption.text : 'No especificado'; // Get name from option text
      const date = document.getElementById('sale-date').value;

      // Update review modal
      document.getElementById('review-salesperson').textContent = salespersonSelect.options[salespersonSelect.selectedIndex].text;
      document.getElementById('review-client').textContent = clientName;
      document.getElementById('review-date').textContent = date;
      document.getElementById('review-discount').textContent = document.getElementById('discount').value || '0';
      document.getElementById('review-wines').textContent = document.getElementById('wines').value || 'No especificado';
      document.getElementById('review-total').textContent = 'Calculando...';

      reviewModal.classList.remove('hidden');
    });

    // Back button in review modal
    document.getElementById('back-btn').addEventListener('click', function() {
      reviewModal.classList.add('hidden');
    });

    // Submit button in review modal - sends data to backend
    document.getElementById('submit-btn').addEventListener('click', function() {
       const selectedClientId = clientTomSelect.getValue(); // Get ID from Tom Select

       const saleData = {
        salesperson: [document.getElementById('salesperson').value], // Array for linked record
        client: selectedClientId ? [selectedClientId] : null, // Array if selected, else null
        saleDate: saleDateInstance.selectedDates[0]?.toISOString().split('T')[0] || null, // ISO YYYY-MM-DD
        discount: parseFloat(document.getElementById('discount').value) || 0,
        wines: document.getElementById('wines').value, // Needs handling if it's a linked record
        orderStatus: document.querySelector('input[name="order-status"]:checked')?.value,
        paymentMethod: document.querySelector('input[name="payment-method"]:checked')?.value,
        documentType: document.querySelector('input[name="document-type"]:checked')?.value,
        documentNumber: document.getElementById('document-number').value || null,
        comments: document.getElementById('comments').value
      };

      // Basic validation
      if (!saleData.salesperson[0] || !saleData.wines) {
          alert('Por favor complete los campos obligatorios (Vendedor, Vinos).');
          return;
      }

      console.log("Sending data:", JSON.stringify(saleData, null, 2));

      fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: saleData }) // Wrap in 'fields' for Airtable
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errData => {
              console.error("Airtable Error Response:", errData);
              throw new Error(errData?.error?.message || `Error en el registro: ${response.statusText}`);
          }).catch(() => {
              throw new Error(`Error en el registro: ${response.statusText} (Status: ${response.status})`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Venta registrada:', data);
        reviewModal.classList.add('hidden');
        successModal.classList.remove('hidden');
      })
      .catch(error => {
        console.error('Error submit:', error);
        alert(`Hubo un error al enviar la venta: ${error.message}`);
      });
    });

    // Function to reset the form
    function resetForm() {
        salesForm.reset();
        // Reset Tom Select for client
        if (clientTomSelect) {
            clientTomSelect.clear(); // Clear selection
            clientTomSelect.clearOptions(); // Clear existing options if needed before re-fetch/re-init
             // Re-add the placeholder if needed, or rely on TomSelect's placeholder
             // Note: Re-fetching contacts might be needed if the list can change dynamically
             // For simplicity here, we assume the initial fetch is sufficient for the session.
             // If re-fetch is needed, call the fetch('/api/contactos') logic again.
        }
        // Reset Flatpickr
        saleDateInstance.setDate(new Date(), true); // Set to today, trigger change event
        // Reset other fields
        charCount.textContent = '0';
        discountHint.classList.add('hidden');
        documentNumberContainer.classList.add('hidden');
        // Reset radio buttons (form.reset() should handle this, but explicit check might be needed)
        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
        // Reset vendor dropdown to default
        document.getElementById('salesperson').selectedIndex = 0;
    }


    // New sale button in success modal
    document.getElementById('new-sale-btn').addEventListener('click', function() {
      successModal.classList.add('hidden');
      resetForm();
    });

    // Cancel button clears form
    document.getElementById('cancel-btn').addEventListener('click', function() {
      if (confirm('¿Está seguro que desea cancelar? Los datos se perderán.')) {
        resetForm();
      }
    });

  });