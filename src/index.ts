import * as cluster from 'cluster';
import * as os from 'os';
import api from './api';

const port: string = process.env.PORT || '8000';
const threads: number =
  parseInt(process.env.WEB_CONCURRENCY) || os.cpus().length || 1;
const ENV = process.env.NODE_ENV;
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < threads; i++) {
    cluster.fork();
  }
  console.log(`server is listening on ${port}`);
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died: ${code}`);
  });
} else {
  if (ENV !== 'test' && ENV !== 'ci') {
    api.listen(port, (err: Error) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      console.log(`Worker ${process.pid} started`);
    });
  }
}
