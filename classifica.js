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
        console.log("Dati ricevuti da Airtable:", data); // Log dettagliato
        populateClassificaTable(data.records);
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Funzione per popolare la tabella con i dati delle squadre
function populateClassificaTable(records) {
    const tbody = document.querySelector('#classifica tbody'); // Seleziona il corpo della tabella

    // Pulisci il contenuto precedente della tabella
    tbody.innerHTML = '';

    // Oggetto per tenere traccia dei punti delle squadre
    const teamPointsMap = {};

    records.forEach(record => {
        const homeTeam = record.fields['IN CASA'];
        const awayTeam = record.fields['FUORI CASA'];

        // Set vinti
        const homeSetsWon = record.fields['CASA'] || 0;
        const awaySetsWon = record.fields['FUORI'] || 0;

        // Aggiorna le statistiche delle squadre
        if (homeTeam) {
            if (!teamPointsMap[homeTeam]) {
                teamPointsMap[homeTeam] = { name: homeTeam, points: 0 };
            }
            teamPointsMap[homeTeam].points += homeSetsWon; // Calcola punti in base ai set vinti
        }

        if (awayTeam) {
            if (!teamPointsMap[awayTeam]) {
                teamPointsMap[awayTeam] = { name: awayTeam, points: 0 };
            }
            teamPointsMap[awayTeam].points += awaySetsWon; // Calcola punti in base ai set vinti
        }
    });

    console.log("Punti delle squadre:", teamPointsMap); 

    // Ordinamento basato sui punti (dal più grande al più piccolo)
    const sortedTeams = Object.values(teamPointsMap).sort((a, b) => b.points - a.points);

   console.log("Squadre ordinate:", sortedTeams); 

   // Popola la tabella con i dati aggregati delle squadre
   sortedTeams.forEach((team, index) => {
       const row = tbody.insertRow(); 

       row.insertCell(0).innerText = index + 1; // Posizione (fissa)
       row.insertCell(1).innerText = team.name; 
       row.insertCell(2).innerText = team.points; 
   });
}

// Chiamata alla funzione per recuperare i dati all'avvio della pagina.
fetchClassificaData();