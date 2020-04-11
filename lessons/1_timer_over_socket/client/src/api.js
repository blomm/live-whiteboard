import openSocket from 'socket.io-client';
import Rx from 'rxjs/Rx';

const socket = openSocket('http://localhost:8000');

export function subscribeToDrawings(cb) {
  // socket.on takes a callback function which is passed the value from
  // the partnering client.emit
  socket.on('drawing', cb);
  socket.emit('subscribeToDrawings');
}

export function subscribeToDrawingLines(drawingId, cb) {
  Rx.Observable.fromEventPattern(
    (h) => socket.on(`drawingLine:${drawingId}`, h),
    (h) => socket.off(`drawingLine:${drawingId}`, h)
  )
    .bufferTime(100)
    .map((lines) => ({ lines }))
    .subscribe((linesEvent) => cb(linesEvent));

  //socket.on(`drawingLine:${drawingId}`, cb);
  socket.emit('subscribeToDrawingLines', drawingId);
}

export function createDrawing(name) {
  socket.emit('createDrawing', { name });
}

export function publishLine({ drawingId, line }) {
  socket.emit('publishLine', { drawingId, ...line });
}
