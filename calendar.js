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

// Funzione per popolare le tabelle con i dati e le giornate
function populateCalendar(records) {
    const calendarBody = document.getElementById('calendar-body'); // Tabella GIRONE ANDATA
    const returnCalendarBody = document.getElementById('return-calendar-body'); // Tabella GIRONE RITORNO

    let currentDay = 1; // Iniziamo dalla GIORNATA 1
    let matchCount = 0; // Variabile per tenere traccia delle partite

    records.forEach(record => {
        const row = document.createElement('tr');
        
        row.insertCell(0).innerText = record.fields['IN CASA'] || 'N/A'; // Squadra in casa
        row.insertCell(1).innerText = record.fields['FUORI CASA'] || 'N/A'; // Squadra in trasferta
        row.insertCell(2).innerText = record.fields['Data'] || 'N/A'; // Data della partita
        row.insertCell(3).innerText = record.fields['Giorno'] || 'N/A'; // Giorno della partita
        row.insertCell(4).innerText = record.fields['Ora'] || 'N/A'; // Ora della partita
        
        matchCount++; // Incrementa il conteggio delle partite

        // Aggiungi la riga alla giusta tabella
        if (currentDay <= 7) {
            calendarBody.appendChild(row); // Aggiungi alla tabella del girone andata
        } else {
            returnCalendarBody.appendChild(row); // Aggiungi alla tabella del girone ritorno
        }

        // Aggiungi una riga per la GIORNATA ogni 4 partite
        if (matchCount % 4 === 0) {
            currentDay++;
            
            const dayRow = document.createElement('tr');
            const cell = dayRow.insertCell(0);
            cell.colSpan = 5;
            
            cell.innerText = `GIORNATA ${currentDay - (currentDay > 7 ? 7 : 0)}`; 
            
            dayRow.style.fontWeight = 'bold';
            dayRow.style.textAlign = 'center';
            dayRow.style.backgroundColor = '#f0f8ff';
            dayRow.style.color = '#000080';

            if (currentDay <= 7) {
                calendarBody.appendChild(dayRow); // Aggiungi alla tabella del girone andata
            } else {
                returnCalendarBody.appendChild(dayRow); // Aggiungi alla tabella del girone ritorno
            }
        }
    });
}

// Chiamata alla funzione per recuperare i dati all'avvio della pagina
fetchCalendarData();
