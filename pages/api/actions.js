import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import axios from 'axios';

export default withApiAuthRequired(async function actions(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res, {});

    const apiPort = process.env.API_PORT || 3001;
    const path = `http://localhost:${apiPort}/api/actions`;

    const response = await axios.get(path, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        cookie: req.headers.cookie
      }
    });

    const actions = await response.data;

    res.status(200).json(actions);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});
