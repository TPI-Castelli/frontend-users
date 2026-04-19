# SmartCity Brescia - Portale Cittadini

Interfaccia web dedicata ai cittadini per la prenotazione e gestione dei posti auto in tempo reale.

## 🚀 Caratteristiche Principali

- **Prenotazione Istantanea**: Sistema di prenotazione rapida ("one-click") con durata automatica configurabile.
- **Disponibilità Live**: Elenco delle aree di sosta con conteggio dei posti liberi aggiornato istantaneamente tramite WebSockets.
- **Le mie Prenotazioni**: Storico personale delle prenotazioni attive e scadute.
- **Notifiche Real-time**: Aggiornamento automatico dei badge di stato (ATTIVA/SCADUTA) non appena scade il tempo di sosta.
- **Persistenza Sessione**: Accesso protetto tramite JWT con mantenimento del login al ricaricamento della pagina.

## 🛠️ Tecnologie Utilizzate

- **React.js** con **TypeScript**
- **Vite** (Build tool)
- **Axios** (Comunicazione API)
- **Socket.io-client** (Aggiornamenti real-time)

## 📦 Installazione e Avvio

1. Assicurati che il backend sia attivo.
2. Naviga nella cartella:
   ```bash
   cd frontend-users
   ```
3. Installa le dipendenze:
   ```bash
   pnpm install
   ```
4. Avvia il server di sviluppo:
   ```bash
   pnpm dev
   ```

## 🔐 Accesso

Per testare le funzionalità, puoi utilizzare le seguenti credenziali di prova:
- **Username**: `user1`
- **Password**: `password1`
