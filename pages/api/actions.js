import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function actions(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res, {
      scopes: ['read:actions']
    });
    console.log(accessToken);
    const apiPort = process.env.API_PORT || 3001;
    const response = await fetch(`http://localhost:${apiPort}/api/actions`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const actions = await response.json();

    res.status(200).json(actions);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});
