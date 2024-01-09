// WebSocketServer.js

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4000 });

wss.on('connection', async (ws) => {
  // Aquí manejas las conexiones WebSocket
  ws.on('message', (message) => {
    console.log('Received: ', message);
    // Aquí podrías procesar el mensaje y enviarlo a los clientes conectados
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

module.exports = wss;
