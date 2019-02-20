import * as express from 'express';
import * as cors from 'cors';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as morgan from 'morgan';

const ENV = process.env.NODE_ENV;

if (ENV !== 'production' && ENV !== 'staging') {
  require('dotenv').config();
}

import {
  genericErrorHandler,
  jwtErrorHandler,
  jwtValidator,
  sendSuccess,
  validationErrorHandler
} from './middleware';

const api: express.Application = express();
const loggingFormat: string = ENV === 'production' ? 'combined' : 'dev';
if (ENV !== 'test') {
  api.use(morgan(loggingFormat));
}
api.use(helmet());
api.use(cors());
api.use(compression());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());

// custom middleware
api.use(jwtValidator(process.env.JWT_SECRET));
api.use(jwtErrorHandler);

// models
require('./models/beer.model');
require('./models/brewery.model');
require('./models/quantity.model');
require('./models/refresh-token.model');
require('./models/user.model');

// routes
require('./routes/auth.routes').default(api);
require('./routes/base.routes').default(api);
require('./routes/beers.routes').default(api);
require('./routes/breweries.routes').default(api);
require('./routes/search.routes').default(api);
require('./routes/users.routes').default(api);

api.use(sendSuccess);
api.use(validationErrorHandler);
api.use(genericErrorHandler);

export default api;
