import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function actions(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res, {
      scopes: ['read:actions']
    });

    const devEnvironment = process.env.DEPLOY_ENV;
    const apiPort = process.env.API_PORT || 3001;
    // const path =
    //   devEnvironment === 'development'
    //     ? `http://localhost:${apiPort}/api/actions`
    //     : `${process.env.DEPLOY_URL}/api/actions`;

    const path = 'https://nextjs-charlie.netlify.app/api/actions'

    const response = await fetch(path, {
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
