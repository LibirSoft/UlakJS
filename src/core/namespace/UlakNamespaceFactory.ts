import type { Middleware } from '../types/middleware/middleware';
import type { UlakNamespace } from '../types/nameSpace/ulakNamespace';

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
