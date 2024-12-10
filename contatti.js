// Configurazione delle credenziali Airtable
const apiKey = 'patQ4fEuvjEX05PHx.cf31ed791fbac42e2e35d96c0f6551f932b4419eceeb506e7faf20b6f5863b98'; // Sostituisci con la tua API Key
const baseId = 'appajBYutiTd1acc9'; // Sostituisci con il tuo Base ID
const tableName = 'Calendario'; // Nome della tua tabella in Airtable

// Funzione per recuperare i dati da Airtable
function fetchContacts() {
    fetch(`https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=AND({ORDINE} >= 1, {ORDINE} <= 8)&sort[0][field]=ORDINE`, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log("Data fetched:", data); // Mostra l'intera risposta dell'API
        populateContacts(data.records);
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Funzione per popolare la tabella con i dati dei contatti
function populateContacts(records) {
    const contactsBody = document.getElementById('contacts-body');

    // Pulisci il corpo della tabella prima di popolare
    contactsBody.innerHTML = '';

    records.forEach(record => {
        const row = contactsBody.insertRow();
        
        row.insertCell(0).innerText = record.fields['SOCIETA'] || 'N/A'; // Società
        row.insertCell(1).innerText = record.fields['REFERENTE'] || 'N/A'; // Referente
        row.insertCell(2).innerText = record.fields['TELEFONO REFERENTE'] || 'N/A'; // Telefono Referente
        row.insertCell(3).innerText = record.fields['ALLENATORE'] || 'N/A'; // Allenatore
        row.insertCell(4).innerText = record.fields['TELEFONO ALLENATORE'] || 'N/A'; // Telefono Allenatore
    });
}

// Carica i contatti all'apertura della pagina
window.onload = fetchContacts;