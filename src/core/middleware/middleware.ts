import type { Socket } from 'socket.io';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';
import type { ExtendedError } from 'socket.io/dist/namespace';

export type Middleware = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  next: (err?: ExtendedError) => void,
) => void;
