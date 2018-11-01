import * as express from 'express';
import * as cors from 'cors';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as morgan from 'morgan';

import {
  genericErrorHandler,
  jwtErrorHandler,
  jwtValidator,
  validationErrorHandler
} from './middleware';

import * as mongoose from 'mongoose';

const ENV = process.env.NODE_ENV;

if (ENV !== 'production' && ENV !== 'staging') {
  require('dotenv').config();
}

mongoose.connect(
  process.env.DB_STRING,
  { useNewUrlParser: true }
);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const db = mongoose.connection;

db.once('open', () => {
  if (ENV !== 'test') {
    console.log(`database connection open`);
  }
});

db.on('error', e => {
  console.log(e);
});

const api = express();
const loggingFormat = ENV === 'production' ? 'combined' : 'dev';
api.use(morgan(loggingFormat));
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
require('./routes/base.routes').default(api);
require('./routes/beers.routes').default(api);
require('./routes/breweries.routes').default(api);
require('./routes/users.routes').default(api);

api.use(validationErrorHandler);
api.use(genericErrorHandler);

export default api;
