import { readdirSync } from 'fs';
import * as path from 'path';
import api from './api';

const port: string = process.env.PORT || '8000';

if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'ci') {
  api.listen(port, (err: Error) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    console.log(`server is listening on ${port}`);
  });
}
