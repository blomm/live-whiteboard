import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8000');

export function subscribeToDrawings(cb) {
  // socket.on takes a callback function which is passed the value from
  // the partnering client.emit
  socket.on('drawing', cb);
  socket.emit('subscribeToDrawings');
}

export function createDrawing(name) {
  socket.emit('createDrawing', { name });
}

export function publishLine({ drawingId, line }) {
  socket.emit('publishLine', { drawingId, ...line });
}
