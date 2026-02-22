import * as express from 'express';
import { Application } from './commons/application';

Application.build({ routes: "src/routes" }).use(express.json()).pipe((app) => {
  // Any thing for app Express instance
}).start();