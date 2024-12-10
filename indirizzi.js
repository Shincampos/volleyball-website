// Configurazione delle credenziali Airtable
const apiKey = 'patQ4fEuvjEX05PHx.cf31ed791fbac42e2e35d96c0f6551f932b4419eceeb506e7faf20b6f5863b98'; // Sostituisci con la tua API Key
const baseId = 'appajBYutiTd1acc9'; // Sostituisci con il tuo Base ID
const tableName = 'Calendario'; // Nome della tua tabella in Airtable

// Funzione per recuperare i dati da Airtable
function fetchAddresses() {
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
        populateAddresses(data.records);
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Funzione per popolare la tabella con gli indirizzi delle società
function populateAddresses(records) {
    const addressesBody = document.getElementById('addresses-body');

    // Pulisci il corpo della tabella prima di popolare
    addressesBody.innerHTML = '';

    records.forEach(record => {
        const row = addressesBody.insertRow();
        
        row.insertCell(0).innerText = record.fields['SOCIETA'] || 'N/A'; // Società
        row.insertCell(1).innerText = record.fields['INDIRIZZO PALESTRA'] || 'N/A'; // Indirizzo Palestra

        // Crea un pulsante per aprire Google Maps
        const addressButton = document.createElement('button');
        addressButton.innerText = 'Naviga';
        
        // Aggiungi un evento click al pulsante
        addressButton.onclick = function() {
            const address = encodeURIComponent(record.fields['INDIRIZZO PALESTRA'] || ''); // Ottieni l'indirizzo
            const url = `https://www.google.com/maps/search/?api=1&query=${address}`; // URL di Google Maps
            window.open(url, '_blank'); // Apri in una nuova scheda
        };

        row.insertCell(2).appendChild(addressButton); // Aggiungi il pulsante alla cella
    });
}

// Carica gli indirizzi all'apertura della pagina
window.onload = fetchAddresses;