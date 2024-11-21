const apiKey = 'patQ4fEuvjEX05PHx.cf31ed791fbac42e2e35d96c0f6551f932b4419eceeb506e7faf20b6f5863b98'; // Sostituisci con il tuo token
const baseId = 'appajBYutiTd1acc9'; // ID della tua base
const tableName = 'calendario'; // Nome della tua tabella

// Funzione per recuperare i dati da Airtable con ordinamento
function fetchCalendarData() {
    fetch(`https://api.airtable.com/v0/${baseId}/${tableName}?sort[0][field]=Data&sort[0][direction]=asc`, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Visualizza l'intera risposta dell'API
        populateCalendar(data.records);
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Funzione per popolare la tabella con i dati e le giornate
function populateCalendar(records) {
    const calendarBody = document.getElementById('calendar-body');

    let currentDay = 1; // Iniziamo dalla GIORNATA 1
    let matchCount = 0; // Variabile per tenere traccia delle partite

    // Aggiungi la riga per GIORNATA 1 subito dopo l'intestazione
    const dayRow = calendarBody.insertRow();
    const cell = dayRow.insertCell(0);
    cell.colSpan = 5; // Colspan per far sì che la scritta occupi tutta la riga
    cell.innerText = `GIORNATA ${currentDay}`; // Scritta GIORNATA 1
    cell.style.fontWeight = 'bold'; // Grassetto per la scritta GIORNATA
    cell.style.textAlign = 'center'; // Centra il testo
    cell.style.backgroundColor = '#f0f8ff'; // Colore di sfondo (puoi cambiarlo)
    cell.style.color = '#000080'; // Colore del testo (puoi cambiarlo)

    records.forEach(record => {
        const row = calendarBody.insertRow();
        row.insertCell(0).innerText = record.fields['SQUADRA CASA'] || 'N/A'; // Squadra in casa
        row.insertCell(1).innerText = record.fields['SQUADRA FUORI'] || 'N/A'; // Squadra in trasferta
        row.insertCell(2).innerText = record.fields['Data'] || 'N/A'; // Data della partita
        row.insertCell(3).innerText = record.fields['Giorno'] || 'N/A'; // Giorno della partita
        row.insertCell(4).innerText = record.fields['Ora'] || 'N/A'; // Ora della partita
        
        matchCount++; // Incrementa il conteggio delle partite

        // Aggiungi una riga per la GIORNATA ogni 4 partite
        if (matchCount % 4 === 0 && matchCount < records.length) {
            currentDay++;
            const dayRow = calendarBody.insertRow();
            const cell = dayRow.insertCell(0);
            cell.colSpan = 5; 
            cell.innerText = `GIORNATA ${currentDay}`; 
            cell.style.fontWeight = 'bold';
            cell.style.textAlign = 'center';
            cell.style.backgroundColor = '#f0f8ff'; // Colore di sfondo (puoi cambiarlo)
            cell.style.color = '#000080'; // Colore del testo (puoi cambiarlo)
        }
    });
}

// Chiamata alla funzione per recuperare i dati all'avvio della pagina
fetchCalendarData();