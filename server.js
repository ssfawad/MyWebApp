const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let players = [];

wss.on('connection', ws => {
  if (players.length < 2) {
    players.push(ws);
    ws.send(JSON.stringify({ type: 'init', player: players.length }));

    ws.on('message', message => {
      players.forEach(p => {
        if (p !== ws && p.readyState === WebSocket.OPEN) {
          p.send(message);
        }
      });
    });

    ws.on('close', () => {
      players = players.filter(p => p !== ws);
    });
  } else {
    ws.send(JSON.stringify({ type: 'full' }));
    ws.close();
  }
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
