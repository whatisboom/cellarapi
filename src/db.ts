import * as mongoose from 'mongoose';
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

export async function db(ENV: string): Promise<void | Error> {
  try {
    if (['dev', 'test', 'ci'].indexOf(ENV) !== -1) {
      await mockgoose.prepareStorage();
    }
    initDB();
  } catch (e) {
    return e;
  }
}

export function initDB() {
  mongoose.connect(
    process.env.DB_STRING,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  );
  const connection: mongoose.Connection = mongoose.connection;
  connection.on('connected', () => {
    if (mockgoose.helper.isMocked()) {
      console.log('using in-memory db');
    }
  });
  connection.on('error', e => {
    throw e;
  });
}

export default db;
