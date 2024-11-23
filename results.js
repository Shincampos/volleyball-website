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

    // Pulisci il contenuto precedente della tabella
    resultsBody.innerHTML = ''; 

    let currentDay = 1; // Iniziamo dalla GIORNATA 1
    let matchCount = 0; // Variabile per tenere traccia delle partite

    records.forEach((record) => {
        // Aggiungi una riga per la GIORNATA ogni 4 partite
        if (matchCount % 4 === 0) {
            const dayRow = resultsBody.insertRow();
            const cell = dayRow.insertCell(0);
            cell.colSpan = 3; // Colspan per far sì che la scritta occupi tutta la riga
            cell.innerText = `GIORNATA ${currentDay}`; 
            cell.style.fontWeight = 'bold';
            cell.style.textAlign = 'center';
            cell.style.backgroundColor = '#f0f8ff'; 
            cell.style.color = '#000080'; 
            currentDay++; // Incrementa la giornata dopo aver aggiunto la riga
        }

        const row = resultsBody.insertRow();
        row.insertCell(0).innerText = record.fields['IN CASA'] || 'N/A'; // Nome della squadra in casa
        row.insertCell(1).innerText = record.fields['FUORI CASA'] || 'N/A'; // Nome della squadra fuori casa
        
        // Gestione dei risultati
        const risultatoCasa = record.fields['CASA'];
        const risultatoFuori = record.fields['FUORI'];

        // Controllo esplicito per gestire valori null e zero
        const casaDisplay = (risultatoCasa !== undefined && risultatoCasa !== null) ? risultatoCasa : 0;
        const fuoriDisplay = (risultatoFuori !== undefined && risultatoFuori !== null) ? risultatoFuori : 0;

        // Inserisci i risultati nella cella sotto l'intestazione "RISULTATO"
        const risultatoCell = row.insertCell(2); 
        risultatoCell.innerText = `${casaDisplay} - ${fuoriDisplay}`; 

        matchCount++; // Incrementa il conteggio delle partite
    });
}

// Chiamata alla funzione per recuperare i dati all'avvio della pagina
fetchResultsData();