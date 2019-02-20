import * as mongoose from 'mongoose';

export async function db(ENV: string): Promise<void | Error> {
  try {
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
      useFindAndModify: false,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000
    }
  );
  const connection: mongoose.Connection = mongoose.connection;
  connection.on('error', (e) => {
    throw e;
  });
}

export default db;
