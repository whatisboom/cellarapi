import * as express from 'express';
import * as cors from 'cors';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import {
  genericErrorHandler,
  jwtErrorHandler,
  jwtValidator,
  validationErrorHandler
} from './middleware';

const api = express();
api.use(helmet());
api.use(cors());
api.use(compression());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());

// custom middleware
api.use(jwtValidator);
api.use(jwtErrorHandler);

// models
require('./models/beer.model');
require('./models/brewery.model');
require('./models/quantity.model');
require('./models/refresh-token.model');
require('./models/user.model');

// routes
require('./routes/auth.routes').default(api);
require('./routes/beers.routes').default(api);
require('./routes/breweries.routes').default(api);
require('./routes/users.routes').default(api);

api.use(validationErrorHandler);
api.use(genericErrorHandler);

export default api;
