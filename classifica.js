const apiKey = 'patQ4fEuvjEX05PHx.cf31ed791fbac42e2e35d96c0f6551f932b4419eceeb506e7faf20b6f5863b98'; // Sostituisci con il tuo token
const baseId = 'appajBYutiTd1acc9'; // Sostituisci con l'ID della tua base
const tableName = 'Calendario'; // Sostituisci con il nome della tua tabella

// Funzione per recuperare i dati da Airtable
function fetchClassificaData() {
    fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
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
        console.log(data); // Log della risposta dell'API
        populateClassifica(data.records);
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Funzione per popolare la tabella con i dati della classifica
function populateClassifica(records) {
    const tbody = document.querySelector('tbody'); // Seleziona il corpo della tabella

    // Pulisci il contenuto precedente della tabella
    tbody.innerHTML = '';

    // Filtra i record per includere solo quelli con POSIZIONE da 1 a 8
    const filteredRecords = records.filter(record => {
        const posizione = record.fields['POSIZIONE'];
        return posizione >= 1 && posizione <= 8;
    });

    // Ordina i record in base alla colonna 'PUNTI' in modo decrescente
    filteredRecords.sort((a, b) => (b.fields['PUNTI'] || 0) - (a.fields['PUNTI'] || 0));

    // Limita a 8 righe (se ci sono più di 8 record)
    const limitedRecords = filteredRecords.slice(0, 8);

    // Popola la tabella mantenendo l'ordine di POSIZIONE
    limitedRecords.forEach(record => {
        const row = tbody.insertRow(); // Crea una nuova riga

        // Aggiungi celle alla riga
        const positionCell = row.insertCell(0);
        const teamCell = row.insertCell(1);
        const pointsCell = row.insertCell(2);

        // Popola le celle con i dati dal record
        positionCell.innerText = record.fields['POSIZIONE'] || 'N/A'; 
        teamCell.innerText = record.fields['SQUADRA'] || 'N/A'; 
        
        // Gestisci i valori di PUNTI, mostrando '0' se è presente
        const puntiValue = record.fields['PUNTI'];
        pointsCell.innerText = (puntiValue !== undefined && puntiValue !== null) ? puntiValue : 'N/A'; 
    });
}

// Chiamata alla funzione per recuperare i dati all'avvio della pagina
fetchClassificaData();