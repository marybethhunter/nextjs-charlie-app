require('dotenv').config({ path: './.env.local' });
const axios = require('axios').default;
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const app = express();
const port = process.env.API_PORT || 3001;
const baseUrl = process.env.AUTH0_BASE_URL;
const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL;
const audience = process.env.AUTH0_AUDIENCE;
const clientID = process.env.AUTH0_CLIENT_ID;
const clientSecret = process.env.AUTH0_CLIENT_SECRET;

if (!baseUrl || !issuerBaseUrl) {
  throw new Error('Please make sure that the file .env.local is in place and populated');
}

if (!audience) {
  console.log('AUTH0_AUDIENCE not set in .env.local. Shutting down API server.');
  process.exit(1);
}

app.use(morgan('dev'));
app.use(helmet());
app.use(cors({ origin: baseUrl }));

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${issuerBaseUrl}/.well-known/jwks.json`
  }),
  audience: audience,
  issuer: `${issuerBaseUrl}/`,
  algorithms: ['RS256']
});

app.use(checkJwt);

app.get('/api/actions', checkJwt, async (req, res) => {
  let options = {
    method: 'POST',
    url: `${issuerBaseUrl}/oauth/token`,
    headers: { 'content-type': 'application/json' },
    data: {
      grant_type: 'client_credentials',
      client_id: clientID,
      client_secret: clientSecret,
      audience: audience
    }
  };

  const managementAPIToken = await axios.request(options).then(res => {
    return `Bearer ${res.data.access_token}`;
  });

  console.log(managementAPIToken);

  // Retrieve all Clients in tenant
  const allClients = await axios
    .get(`${audience}/clients`, {
      headers: { authorization: managementAPIToken }
    })
    .then(res => {
      return res.data;
    });

  // Retrieve all Actions in tenant
  const allActions = await axios
    .get(`${audience}/actions/actions`, {
      headers: { authorization: managementAPIToken }
    })
    .then(res => {
      return res.data;
    });
});

const server = app.listen(port, () => console.log(`API Server listening on port ${port}`));
process.on('SIGINT', () => server.close());
