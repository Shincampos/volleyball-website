const apiKey = 'patQ4fEuvjEX05PHx.cf31ed791fbac42e2e35d96c0f6551f932b4419eceeb506e7faf20b6f5863b98'; // Sostituisci con il tuo token
const baseId = 'appajBYutiTd1acc9'; // Sostituisci con l'ID della tua base
const tableName = 'Calendario'; // Sostituisci con il nome della tua tabella

// Funzione per recuperare i dati da Airtable
function fetchPartiteData() {
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
        populateStatisticsTable(data.records);
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Funzione per popolare la tabella con i dati delle partite
function populateStatisticsTable(records) {
    const tbody = document.querySelector('#statistiche tbody'); // Seleziona il corpo della tabella

    // Pulisci il contenuto precedente della tabella
    tbody.innerHTML = '';

    // Oggetto per tenere traccia dei dati delle squadre
    const teamStats = {};

    records.forEach(record => {
        const homeTeam = record.fields['IN CASA'];
        const awayTeam = record.fields['FUORI CASA'];
        
        // Punti fatti e subiti per la squadra in casa
        const homePointsScored = (record.fields['1 SET IN'] || 0) + (record.fields['2 SET IN'] || 0) + (record.fields['3 SET IN'] || 0);
        const awayPointsScored = (record.fields['1 SET OUT'] || 0) + (record.fields['2 SET OUT'] || 0) + (record.fields['3 SET OUT'] || 0);

        // Set vinti e persi
        const homeSetsWon = record.fields['CASA'] || 0;
        const awaySetsWon = record.fields['FUORI'] || 0; // Assicurati di definire questa variabile
        const homeSetsLost = record.fields['FUORI'] || 0;
        const awaySetsLost = record.fields['CASA'] || 0;

        // Controlla se i nomi delle squadre sono definiti
        if (homeTeam && awayTeam) {
            // Inizializza le statistiche delle squadre se non esistono
            if (!teamStats[homeTeam]) {
                teamStats[homeTeam] = {
                    name: homeTeam,
                    matchesPlayed: 0,
                    matchesWon: 0,
                    matchesLost: 0,
                    setsWon: 0,
                    setsLost: 0,
                    pointsScored: 0,
                    pointsConceded: 0
                };
            }
            
            if (!teamStats[awayTeam]) {
                teamStats[awayTeam] = {
                    name: awayTeam,
                    matchesPlayed: 0,
                    matchesWon: 0,
                    matchesLost: 0,
                    setsWon: 0,
                    setsLost: 0,
                    pointsScored: 0,
                    pointsConceded: 0
                };
            }

            // Aggiorna le statistiche delle squadre in base ai risultati della partita
            teamStats[homeTeam].setsWon += homeSetsWon;
            teamStats[homeTeam].setsLost += homeSetsLost;
            teamStats[homeTeam].pointsScored += homePointsScored; // Punti fatti dalla squadra in casa
            teamStats[homeTeam].pointsConceded += awayPointsScored; // Punti subiti dalla squadra in casa
            
            teamStats[awayTeam].setsWon += awaySetsWon; // Set vinti dalla squadra fuori casa
            teamStats[awayTeam].setsLost += awaySetsLost; // Set persi dalla squadra fuori casa
            teamStats[awayTeam].pointsScored += awayPointsScored; // Punti fatti dalla squadra fuori casa
            teamStats[awayTeam].pointsConceded += homePointsScored; // Punti subiti dalla squadra fuori casa

            // Incrementa le partite giocate solo se i set corrispondono a combinazioni valide
            if (
                (homeSetsWon === 3 && homeSetsLost === 0) ||
                (homeSetsWon === 2 && homeSetsLost === 1) ||
                (homeSetsWon === 1 && homeSetsLost === 2) ||
                (homeSetsWon === 0 && homeSetsLost === 3)
            ) {
                teamStats[homeTeam].matchesPlayed++; // Incrementa per la squadra in casa
                teamStats[awayTeam].matchesPlayed++; // Incrementa anche per la squadra fuori casa
                
                // Incrementa partite vinte e perse in base ai risultati
                if ((homeSetsWon === 3 && homeSetsLost === 0) || (homeSetsWon === 2 && homeSetsLost === 1)) {
                    teamStats[homeTeam].matchesWon++;   // Squadra di casa vince
                    teamStats[awayTeam].matchesLost++;   // Squadra fuori perde
                } else if ((awaySetsWon === 3 && awaySetsLost === 0) || (awaySetsWon === 2 && awaySetsLost === 1)) {
                    teamStats[awayTeam].matchesWon++;   // Squadra fuori vince
                    teamStats[homeTeam].matchesLost++;   // Squadra di casa perde
                }
            }
        }
    });

    console.log("Statistiche delle squadre:", teamStats); 

    // Ordinamento basato sui set vinti, poi sui punti totali se necessario.
    const sortedTeams = Object.values(teamStats).sort((a, b) => {
        if (b.setsWon !== a.setsWon) { 
           return b.setsWon - a.setsWon; 
       } else { 
           return b.pointsScored - a.pointsScored;
       }
   });

   console.log("Squadre ordinate:", sortedTeams); 

   sortedTeams.forEach((team, index) => {
       if (index < 8) { 
           const row = tbody.insertRow(); 

           row.insertCell(0).innerText = index + 1; 
           row.insertCell(1).innerText = team.name; 
           row.insertCell(2).innerText = team.setsWon; 
           row.insertCell(3).innerText = team.matchesPlayed; 
           row.insertCell(4).innerText = team.matchesWon; 
           row.insertCell(5).innerText = team.matchesLost; 
           row.insertCell(6).innerText = team.setsWon; 
           row.insertCell(7).innerText = team.setsLost; 
           row.insertCell(8).innerText = team.pointsScored; 
           row.insertCell(9).innerText = team.pointsConceded;

           row.insertCell(10).innerText = (team.setsLost !== 0) ? (team.setsWon / team.setsLost).toFixed(2) : 'N/A';
           row.insertCell(11).innerText = (team.pointsConceded !== 0) ? (team.pointsScored / team.pointsConceded).toFixed(2) : 'N/A';
       }
   });
}

// Chiamata alla funzione per recuperare i dati all'avvio della pagina.
fetchPartiteData();