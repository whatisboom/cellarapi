import api from './api';
import db from './db';

const port: string = process.env.PORT || '8000';

const ENV = process.env.NODE_ENV;
if (ENV !== 'test' && ENV !== 'ci') {
  db(ENV).then(() => {
    api.listen(port, (err: Error) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      console.log(`server is listening on ${port}`);
    });
  });
}
