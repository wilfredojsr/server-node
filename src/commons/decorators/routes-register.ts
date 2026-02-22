import 'reflect-metadata';

const paramMetadataKey = Symbol('Param');
const queryMetadataKey = Symbol('Query');
const bodyMetadataKey = Symbol('Body');

export function Routes(path: string) {
  return function (target: any) {
    const constructor = target.prototype.constructor;
    constructor.path = path;

    target.prototype.instance = (app) => {
      const keys = Object.getOwnPropertyNames(target.prototype);
      keys.forEach(key => {
        if (key !== 'instance' && key !== 'constructor') {
          const el = target.prototype[key];
          if (el instanceof IRoute) {
            const { method, path: routePath, handler } = el;
            const mapped = `/${(path || '').replace('/', '')}${(routePath || '').replace('/', '')}`;
            console.log(`Route -> ${method.toUpperCase()} ${mapped}`);
            app[method.toLowerCase()](mapped, handler);
          }
        }
      });
    };
  };
}

export function Route(method: string, path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const func = descriptor.value;
    const route = new IRoute();
    route.method = method;
    route.path = path;
    route.handler = (req, res) => {
      let params: { index: number, name: string }[] =
        Reflect.getOwnMetadata(paramMetadataKey, target, propertyKey) || [];
      let query: { index: number, name: string }[] =
        Reflect.getOwnMetadata(queryMetadataKey, target, propertyKey) || [];
      let body: { index: number, name: string }[] =
        Reflect.getOwnMetadata(bodyMetadataKey, target, propertyKey) || [];

      const args = [...params, ...query, ...body].sort((a, b) => a.index - b.index)
        .map(param => req.params[param.name] || req.query[param.name] || (param.name === '@@body@@' ? req.body : undefined));

      res.send(func.apply(target, args));
    };
    descriptor.value = route;
  };
}

export function Param(paramName: string) {
  return function (target: Object, propertyKey: string, parameterIndex: number) {
    let params: { index: number, name: string }[] =
      Reflect.getOwnMetadata(paramMetadataKey, target, propertyKey) || [];

    params.push({
      index: parameterIndex,
      name: paramName
    });

    Reflect.defineMetadata(paramMetadataKey, params, target, propertyKey);
  };
}

export function Query(paramName: string) {
  return function (target: Object, propertyKey: string, parameterIndex: number) {
    let query: { index: number, name: string }[] =
      Reflect.getOwnMetadata(queryMetadataKey, target, propertyKey) || [];

    query.push({
      index: parameterIndex,
      name: paramName
    });

    Reflect.defineMetadata(queryMetadataKey, query, target, propertyKey);
  };
}

export function Body() {
  return function (target: Object, propertyKey: string, parameterIndex: number) {
    let body: { index: number, name: string }[] =
      Reflect.getOwnMetadata(bodyMetadataKey, target, propertyKey) || [];

    body.push({
      index: parameterIndex,
      name: '@@body@@'
    });

    Reflect.defineMetadata(bodyMetadataKey, body, target, propertyKey);
  };
}

class IRoute {
  method: string;
  path: string;
  handler: (req: any, res: any) => any;
}