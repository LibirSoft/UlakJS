import type { Middleware } from '../types/middleware/middleware';
import type { NamespaceDescriptor, NamespaceParams, UlakNamespace } from '../types/nameSpace/ulakNamespace';

export class UlakNamespaceFactory {
  private _namespaces: UlakNamespace[] = [];

  private _middlewares: Middleware[] = [];

  public get namespace(): UlakNamespace[] {
    return this._namespaces;
  }

  public set namespace(value: UlakNamespace[]) {
    this._namespaces = value;
  }

  public get middlewares(): Middleware[] {
    return this._middlewares;
  }

  public set middlewares(value: Middleware[]) {
    this._middlewares = value;
  }
}

export type PublicConstructor<T> = new () => T;

export function NamespaceFactory(middleware: Middleware[]) {
  return function (ulakNamespaceFactory: typeof UlakNamespaceFactory): PublicConstructor<any> {
    return class extends ulakNamespaceFactory {
      public constructor() {
        super();
        this.middlewares = middleware;

        for (const methodName of Object.getOwnPropertyNames(ulakNamespaceFactory.prototype)) {
          const descriptor = Object.getOwnPropertyDescriptor(ulakNamespaceFactory.prototype, methodName);

          if (descriptor && descriptor.value && descriptor.value.isNameSpace) {
            this[methodName] = this[methodName].bind(this);
            this[methodName]();
          }
        }
      }
    };
  };
}

export function NameSpace({ namespace, description, middlewares }: NamespaceParams) {
  return function (factory: UlakNamespaceFactory, propertyKey: string, descriptor: NamespaceDescriptor) {
    const originalMethod = descriptor.value;

    if (originalMethod === undefined) {
      throw new Error('Decorator can only be used in a method');
    }

    descriptor.value = function () {
      const hermesNameSpace: UlakNamespace = {
        namespace,
        description,
        middlewares,
        eventFactories: originalMethod(),
      };

      this.namespace.push(hermesNameSpace);
      return originalMethod.apply(this);
    };

    // @ts-ignore
    descriptor.value.isNameSpace = true;

    return descriptor;
  };
}
