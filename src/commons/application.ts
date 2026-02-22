import * as express from 'express';
import { Configurations } from './configurations';
import {Express} from "express";

export class Application {
  private readonly port = Configurations.get('PORT') || 3000;
  private readonly app: Express;

  constructor() {
    this.app = express();
  }

  static build(options?: ApplicationOptions) {
    const newApp = new Application();
    if (!options) {
      console.warn('Routes not provided. Consider using Application.build({ routes: "path/to/routes" })');
      return newApp;
    }
    if (!options.routes) {
      console.warn('Routes not found');
      return newApp;
    }
    Object.values(options.routes).forEach((route: any) => (new route()['instance'](newApp.app)));
    return newApp;
  }

  use(middleware: any) {
    this.app.use(middleware);
    return this;
  }

  pipe(func: (self?: Express) => void) {
    typeof func === 'function' && func(this.app);
    return this;
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port -> ${this.port}`);
    });
    return this;
  }
}

interface ApplicationOptions {
  routes: [any];
}