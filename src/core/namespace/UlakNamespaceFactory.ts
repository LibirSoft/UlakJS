import type { Middleware } from '../types/middleware/middleware';
import type { NamespaceDescriptor, NamespaceParams, UlakNamespace } from '../types/namespace/ulakNamespace';

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

export function NamespaceFactory(middleware?: Middleware[]) {
  return function (ulakNamespaceFactory: typeof UlakNamespaceFactory): PublicConstructor<any> {
    return class extends ulakNamespaceFactory {
      public constructor() {
        super();
        this.middlewares = middleware || [];

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

export function NameSpace(_params?: NamespaceParams) {
  return function (factory: UlakNamespaceFactory, propertyKey: string, descriptor: NamespaceDescriptor) {
    const originalMethod = descriptor.value;

    if (originalMethod === undefined) {
      throw new Error('Decorator can only be used in a method');
    }

    let _namespaceParams = _params;

    if (_namespaceParams === undefined || _namespaceParams === null) {
      _namespaceParams = { namespace: '', description: '', middlewares: [] };
    }

    descriptor.value = function () {
      const ulakNamespace: UlakNamespace = {
        namespace: _namespaceParams.namespace,
        description: _namespaceParams.description,
        middlewares: _namespaceParams.middlewares,
        eventFactories: originalMethod(),
      };

      // if any ulakNamespace.namespace is already exist, throw an error
      if (this.namespace.find((namespace) => namespace.namespace === ulakNamespace.namespace)) {
        throw new Error('Namespace is already exist');
      }

      this.namespace.push(ulakNamespace);

      return originalMethod.apply(this);
    };

    // @ts-ignore
    descriptor.value.isNameSpace = true;

    return descriptor;
  };
}
