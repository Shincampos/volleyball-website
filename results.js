const apiKey = 'patQ4fEuvjEX05PHx.cf31ed791fbac42e2e35d96c0f6551f932b4419eceeb506e7faf20b6f5863b98'; // Sostituisci con il tuo token
const baseId = 'appajBYutiTd1acc9'; // ID della tua base
const tableName = 'Calendario'; // Nome della tua tabella

// Funzione per recuperare i dati da Airtable
function fetchResultsData() {
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
        populateResults(data.records);
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Funzione per popolare la tabella con i risultati e le giornate
function populateResults(records) {
    const resultsBody = document.getElementById('results-body');

    // Aggiungi la riga per GIORNATA 1 subito dopo l'intestazione
    const dayRow = resultsBody.insertRow();
    const cell = dayRow.insertCell(0);
    cell.colSpan = 4; // Colspan per far sì che la scritta occupi tutta la riga
    cell.innerText = `GIORNATA 1`; // Scritta GIORNATA 1
    cell.style.fontWeight = 'bold'; // Grassetto per la scritta GIORNATA
    cell.style.textAlign = 'center'; // Centra il testo
    cell.style.backgroundColor = '#f0f8ff'; // Colore di sfondo (puoi cambiarlo)
    cell.style.color = '#000080'; // Colore del testo (puoi cambiarlo)

    let matchCount = 0; // Variabile per tenere traccia delle partite

    records.forEach((record, index) => {
        const row = resultsBody.insertRow();
        row.insertCell(0).innerText = record.fields['IN CASA'] || 'N/A'; // Nome della squadra in casa
        row.insertCell(1).innerText = record.fields['FUORI CASA'] || 'N/A'; // Nome della squadra fuori casa
        row.insertCell(2).innerText = record.fields['CASA'] || 'N/A'; // Risultato del Set Casa
        row.insertCell(3).innerText = record.fields['FUORI'] || 'N/A'; // Risultato del Set Fuori
        
        matchCount++; // Incrementa il conteggio delle partite

        // Aggiungi una riga per la GIORNATA ogni 4 partite
        if (matchCount % 4 === 0) {
            const dayRow = resultsBody.insertRow();
            const cell = dayRow.insertCell(0);
            cell.colSpan = 4; 
            cell.innerText = `GIORNATA ${Math.floor(matchCount / 4) + 1}`; 
            cell.style.fontWeight = 'bold';
            cell.style.textAlign = 'center';
            cell.style.backgroundColor = '#f0f8ff'; 
            cell.style.color = '#000080'; 
        }
    });
}

// Chiamata alla funzione per recuperare i dati all'avvio della pagina
fetchResultsData();
