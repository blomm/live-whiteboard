import openSocket from 'socket.io-client';
import Rx from 'rxjs/Rx';
const port = parseInt(window.location.search.replace('?', ''), 10) || 8000;
const socket = openSocket(`http://localhost:${port}`);

export function subscribeToDrawings(cb) {
  // socket.on takes a callback function which is passed the value from
  // the partnering client.emit
  socket.on('drawing', cb);
  socket.emit('subscribeToDrawings');
}

export function subscribeToConnectionEvent(cb) {
  socket.on('connect', () => cb({ state: 'connected', port }));
  socket.on('disconnect', () => cb({ state: 'disconnected', port }));
  socket.on('connect_error', () => cb({ state: 'disconnected', port }));
}

export function subscribeToDrawingLines(drawingId, cb) {
  const reconnectStream = Rx.Observable.fromEventPattern(
    (h) => socket.on('connect', h),
    (h) => socket.off('connect', h)
  );

  const lineStream = Rx.Observable.fromEventPattern(
    (h) => socket.on(`drawingLine:${drawingId}`, h),
    (h) => socket.off(`drawingLine:${drawingId}`, h)
  );

  const maxStream = lineStream
    .map((line) => new Date(line.timestamp).getTime())
    .scan((a, b) => Math.max(a, b), 0);

  reconnectStream.withLatestFrom(maxStream).subscribe((joined) => {
    const lastReceivedTimestamp = joined[1];
    socket.emit('subscribeToDrawingLines', {
      drawingId,
      from: lastReceivedTimestamp,
    });
  });

  const bufferedTimeStream = lineStream
    .bufferTime(100)
    .map((lines) => ({ lines }));

  bufferedTimeStream.subscribe((linesEvent) => cb(linesEvent));

  //socket.on(`drawingLine:${drawingId}`, cb);
  socket.emit('subscribeToDrawingLines', { drawingId });
}

export function createDrawing(name) {
  socket.emit('createDrawing', { name });
}

export function publishLine({ drawingId, line }) {
  socket.emit('publishLine', { drawingId, ...line });
}
