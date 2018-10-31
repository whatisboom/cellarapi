import { Router } from 'express';

export default function baseRoutes(api: Router): void {
  api.route('/').get((req, res) => {
    res.status(200).send('🤙');
  });
}
