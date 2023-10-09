const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (data) => {

        if (Buffer.isBuffer(data)) {
            // Inspect the first few bytes of the data to determine the content type
            const firstBytes = data.slice(0, 2).toString('hex'); // Get the first 2 bytes as hexadecimal
            
            console.log(firstBytes)
            if (firstBytes === 'ffd8') {
                // Content type is JPEG
                console.log('Received JPEG data');
                // Process the JPEG data here
            } else {
                // Unknown content type
                console.log('Received data with unknown content type');
            }
        }

        // Broadcast the data to other clients
        server.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
