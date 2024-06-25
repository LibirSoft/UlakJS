import type { Middleware } from '../middleware/middleware';
import type { UlakEventFactory } from '../../event/UlakEventFactory';

export interface UlakNamespace extends NamespaceParams {
  eventFactories: UlakEventFactory[];
}

export interface NamespaceParams {
  namespace: string;
  middlewares?: Middleware[];
  description?: string;
}
