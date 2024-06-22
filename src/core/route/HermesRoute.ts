import type { HermesEvent } from '../types/socket/event';
import type { Server, Socket } from 'socket.io';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';

export class HermesRoute {
  private _events: HermesEvent[] = [];

  private _description: string;

  private _path: string;

  private _socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

  private _io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

  public add(event: HermesEvent): void {
    this._events.push(event);
  }

  public get events(): HermesEvent[] {
    return this._events;
  }

  public get socket(): Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
    return this._socket;
  }

  public set socket(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    this._socket = socket;
  }

  public get io(): Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
    return this._io;
  }

  public set io(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    this._io = io;
  }
}

interface RouteParams {
  path: string;
  description: string;
}

export function Route({ path, description }: RouteParams) {
  return function (constructor: any) {
    constructor.prototype.path = path;
    constructor.prototype.description = description;
  };
}
