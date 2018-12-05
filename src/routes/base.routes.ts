import { Router } from 'express';

export default function baseRoutes(api: Router): void {
  api.route('/').get((req, res) => {
    res.status(200).send('🤙');
  });
  api.route('/loaderio-a44aad14bfb7bb1081e8ac42fe371a62').get((req, res) => {
    res.send('loaderio-a44aad14bfb7bb1081e8ac42fe371a62');
  });
}
