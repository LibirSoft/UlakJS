import type { Middleware } from '../middleware/middleware';
import type { HermesRoute } from '../route/HermesRoute';

export class NameSpace {
  private _routes: HermesRoute[] = [];

  private _namespace: string;

  private _middlewares: Middleware[] = [];

  public get routes(): HermesRoute[] {
    return this._routes;
  }

  public set routes(value: HermesRoute[]) {
    this._routes = value;
  }

  public get namespace(): string {
    return this._namespace;
  }

  public set namespace(value: string) {
    this._namespace = value;
  }

  public get middlewares(): Middleware[] {
    return this._middlewares;
  }

  public set middlewares(value: Middleware[]) {
    this._middlewares = value;
  }
}
