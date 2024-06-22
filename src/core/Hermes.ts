import type { DefaultEventsMap } from 'socket.io/dist/typed-events';
import type { Socket } from 'socket.io';
import type { Server } from 'socket.io';
import type { NameSpace } from './namespace/NameSpace';
import type { Middleware } from './middleware/middleware';

export class Hermes {
  private server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

  private namespaces: NameSpace[] = [];

  private middlewares: Middleware[] = [];

  public constructor(server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    this.server = server;
  }

  public start(callback?: () => void | Promise<void>): void {
    // bind middlewares to server
    for (const middleware of this.middlewares) {
      this.server.use(middleware);
    }

    // bind namespaces to server
    this.bindNameSpaces();

    if (callback) callback();
  }

  private bindNameSpaces() {
    for (const namespace of this.namespaces) {
      // bind middlewares to namespace
      for (const middleware of namespace.middlewares) {
        this.server.use(middleware);
      }

      this.server.of(namespace.namespace, (socket: Socket) => {
        // bind routes to namespace
        this.bindRoutes(namespace, socket);
      });
    }
  }

  private bindRoutes(namespace: NameSpace, socket: Socket) {
    for (const route of namespace.routes) {
      route.io = this.server;
      route.socket = socket;

      for (const event of route.events) {
        socket.on(event.event, async (data) => {
          await event.listener(data);
        });
      }
    }
  }

  public addNamespace(namespace: NameSpace): Hermes {
    this.namespaces.push(namespace);
    return this;
  }

  public getNamespaces(): NameSpace[] {
    return this.namespaces;
  }

  public addMiddleware(middleware: Middleware): Hermes {
    this.middlewares.push(middleware);
    return this;
  }

  public getMiddlewares(): Middleware[] {
    return this.middlewares;
  }
}
