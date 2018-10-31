import { readdirSync } from 'fs';
import * as path from 'path';
import api from './api';
import * as mongoose from 'mongoose';

const port: string = process.env.PORT || '8000';

mongoose.connect(
  process.env.DB_STRING,
  { useNewUrlParser: true }
);
mongoose.set('useCreateIndex', true);

api.listen(port, (err: Error) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  const db = mongoose.connection;
  db.once('open', () => {
    console.log(`database connection open`);
  });
  db.on('error', e => {
    console.log(e);
  });
  console.log(`server is listening on ${port}`);
});
