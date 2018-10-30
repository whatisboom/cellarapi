import * as express from 'express';
import * as cors from 'cors';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import {
  genericErrorHandler,
  jwtErrorHandler,
  jwtValidator
} from './middleware';

const api = express();
api.use(helmet());
api.use(cors());
api.use(compression());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());

api.use(jwtValidator);
api.use(jwtErrorHandler);
api.use(genericErrorHandler);

export default api;
