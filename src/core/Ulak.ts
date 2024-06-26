import type { DefaultEventsMap } from 'socket.io/dist/typed-events';
import type { Namespace, Server } from 'socket.io';
import type { UlakNamespaceFactory } from './namespace/UlakNamespaceFactory';
import type { UlakNamespace } from './types/nameSpace/ulakNamespace';
import type { LoggerOptions } from './types/logger/logger';
import type { UlakEventFactory } from './event/UlakEventFactory';

export class Ulak {
  private readonly server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

  private namespaceFactory: UlakNamespaceFactory;

  private loggerOptions: LoggerOptions = { enable: false };

  public constructor(
    server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    loggerOptions?: LoggerOptions,
  ) {
    this.server = server;
    if (loggerOptions) {
      this.loggerOptions = loggerOptions;
    }
  }

  public start(callback?: () => void | Promise<void>): void {
    // bind namespaces to server
    this.bindNamespaces();

    if (callback) callback();
  }

  private bindNamespaces() {
    // bind nameSpace factory middlewares to server

    const boundenGlobalMiddleWares: string[] = [];

    this.server.on('new_namespace', (namespace) => {
      for (const middleware of this.namespaceFactory.middlewares) {
        if (!boundenGlobalMiddleWares.includes(middleware.name)) {
          if (this.loggerOptions.enable) this.getLogger().log('Global Middleware bound: ', middleware.name);
          boundenGlobalMiddleWares.push(middleware.name);
        }
        namespace.use(middleware);
      }
    });

    for (const namespace of this.namespaceFactory.namespace) {
      // bind middlewares to namespace

      const _namespace = this.server.of(namespace.namespace);

      if (namespace.middlewares) {
        for (const middleware of namespace.middlewares) {
          if (this.loggerOptions.enable)
            this.getLogger().log(
              `${middleware.name} Middleware bound to namespace: ${namespace.namespace === '' ? 'Default' : namespace.namespace}`,
            );
          _namespace.use(middleware);
        }
      }

      this.bindNamespaceEvents(namespace, _namespace);
    }
  }

  private bindNamespaceEvents(
    namespace: UlakNamespace,
    ioNamesapce: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    for (const ulakEventFactory of namespace.eventFactories) {
      ulakEventFactory.io = this.server;
      ulakEventFactory.namespace = ioNamesapce;

      ioNamesapce.on('connection', async (socket) => {
        ulakEventFactory.socket = socket;

        for (const event of ulakEventFactory.events) {
          socket.on(ulakEventFactory.path + event.event, async (data) => {
            const boundListener = event.listener.bind(ulakEventFactory);

            await boundListener(data);
          });
        }
      });
      if (this.loggerOptions.enable) {
        this.logEventFactories(ulakEventFactory, namespace);
      }
    }
  }

  public addNamespaceFactory(namespaceFactory: UlakNamespaceFactory): Ulak {
    this.namespaceFactory = namespaceFactory;
    return this;
  }

  public getNamespaceFactory(): UlakNamespaceFactory {
    return this.namespaceFactory;
  }

  private getLogger() {
    return this.loggerOptions.logger || console;
  }

  private logEventFactories(ulakEventFactory: UlakEventFactory, namespace: UlakNamespace) {
    for (const event of ulakEventFactory.events) {
      this.getLogger().log(
        `${event.event} event bounded to ${namespace.namespace === '' ? 'Default' : namespace.namespace} namespace path is: ${ulakEventFactory.path}${event.event}`,
      );
    }
  }
}
