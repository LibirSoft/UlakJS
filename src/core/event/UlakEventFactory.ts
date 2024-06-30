import type { UlakEvent } from '../types/socket/event';
import type { Namespace, Server, Socket } from 'socket.io';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';
import type { PublicConstructor } from '../namespace/UlakNamespaceFactory';

export class UlakEventFactory {
  private _events: UlakEvent[] = [];

  private _description: string;

  private _path: string;

  private _socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

  private _io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

  private _namespace: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

  public add(event: UlakEvent): void {
    this._events.push(event);
  }

  public get events(): UlakEvent[] {
    return this._events;
  }

  public set events(events: UlakEvent[]) {
    this._events = events;
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

  public get description(): string {
    return this._description;
  }

  public set description(value: string) {
    this._description = value;
  }

  public get path(): string {
    return this._path;
  }

  public set path(value: string) {
    this._path = value;
  }

  public get namespace(): Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
    return this._namespace;
  }

  public set namespace(value: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    this._namespace = value;
  }
}

interface EventFactoryParams {
  prefix?: string;
  description?: string;
}

export function EventFactory(params?: EventFactoryParams) {
  return function (eventFactory: typeof UlakEventFactory): PublicConstructor<any> {
    return class extends eventFactory {
      public constructor() {
        super();
        this.path = params?.prefix || '';
        this.description = params?.description || '';

        for (const methodName of Object.getOwnPropertyNames(eventFactory.prototype)) {
          const descriptor = Object.getOwnPropertyDescriptor(eventFactory.prototype, methodName);

          if (descriptor && descriptor.value && descriptor.value.isEvent) {
            this.events.push(descriptor.value.eventValues);
          }
        }
      }
    };
  };
}

export function Event(event: string) {
  return function (target: UlakEventFactory, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value.isEvent = true;
    descriptor.value.eventValues = { event, listener: originalMethod } satisfies UlakEvent;

    return descriptor;
  };
}
