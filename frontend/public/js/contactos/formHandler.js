// frontend/public/js/contactos/formHandler.js
import { validateContactForm } from '../../validation.js'; // Shared validations

export default class ContactosForm {
  constructor() {
    this.form = document.getElementById('contactos-form');
    this.initialize();
  }

  initialize() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    const formData = {
      name: this.form.elements['nombre'].value,
      rut: this.form.elements['rut'].value,
      // ... other fields
    };

    if (!validateContactForm(formData)) return;

    try {
      const response = await fetch('/api/contactos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.mapToAirtableFormat(formData))
      });
      
      if (!response.ok) throw new Error('API Error');
      this.showSuccess();
    } catch (error) {
      this.showError(error.message);
    }
  }

  // --- START MAPPING (Revised based on user feedback) ---
  const airtableFields = {};
  // Determine type based on the active button, NOT the hidden input anymore
  const isBusiness = document.querySelector('.client-type-btn[data-type="business"]').classList.contains('active');

  // 1. Set 'Tipo' field based on the active form
  if (isBusiness) {
      airtableFields['Tipo'] = rawClientData['business-type'] || ''; // Value from dropdown
  } else {
      airtableFields['Tipo'] = 'Cliente Final'; // Fixed value for individuals
  }

  // 2. Map fields based on whether it's Business or Individual
  if (isBusiness) {
      airtableFields['Nombre'] = rawClientData['business-name'] || ''; // Company Name
      airtableFields['Apellido'] = rawClientData['business-contact'] || ''; // Contact Person Name
      airtableFields['RUT'] = rawClientData['business-rut'] || '';
      airtableFields['Correo Electrónico'] = rawClientData['business-email'] || '';
      airtableFields['Número de Teléfono'] = rawClientData['business-phone'] || '';
      airtableFields['Dirección'] = rawClientData['business-address'] || '';
      const bizInsta = rawClientData['business-instagram'];
      airtableFields['Instagram Username'] = (bizInsta && bizInsta.startsWith('@')) ? bizInsta.substring(1) : bizInsta || '';
      airtableFields['Pais'] = rawClientData['business-country'] || 'Chile';
      airtableFields['Notas'] = rawClientData['business-comments'] || '';

  } else { // Individual ('Cliente Final')
      airtableFields['Nombre'] = rawClientData['client-firstname'] || ''; // Individual First Name
      airtableFields['Apellido'] = rawClientData['client-lastname'] || ''; // Individual Last Name
      airtableFields['RUT'] = rawClientData['client-rut'] || '';
      airtableFields['Correo Electrónico'] = rawClientData['client-email'] || '';
      airtableFields['Número de Teléfono'] = rawClientData['client-phone'] || '';
      airtableFields['Dirección'] = rawClientData['client-address'] || '';
      const indiInsta = rawClientData['client-instagram'];
      airtableFields['Instagram Username'] = (indiInsta && indiInsta.startsWith('@')) ? indiInsta.substring(1) : indiInsta || '';
      airtableFields['Pais'] = rawClientData['client-country'] || 'Chile';
      airtableFields['Notas'] = rawClientData['client-comments'] || '';
  }
  // --- END MAPPING ---

  console.log("Mapped data for Airtable:", airtableFields); // Keep this for debugging initially

  // Check if any essential field (like Tipo or Nombre) is unexpectedly empty
  if (!airtableFields['Tipo']) {
       console.warn("Airtable 'Tipo' field is empty. Check logic.");
       // Optional: handle this case, maybe show an error
  }
  if (!airtableFields['Nombre']) {
       console.warn("Airtable 'Nombre' field is empty. Check logic.");
       // Optional: handle this case
  }


  // ... rest of the saveClientBtn logic (disable button, fetch call, etc.) ...

  // Ensure the fetch call sends the CORRECT object:
  // body: JSON.stringify({ fields: airtableFields }) // Sending the mapped data
