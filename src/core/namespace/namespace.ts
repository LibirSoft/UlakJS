import type { NamespaceParams, UlakNamespace } from '../types/nameSpace/ulakNamespace';
import type { UlakEventFactory } from '../event/UlakEventFactory';
import type { UlakNamespaceFactory } from './UlakNamespaceFactory';

interface NamespaceDescriptor extends PropertyDescriptor {
  value?: (...args: any[]) => UlakEventFactory[];
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
