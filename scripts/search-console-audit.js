const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const DEFAULT_PROPERTY = 'https://www.tuasesordemoda.com/';
const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];

function getJsonCredentials() {
  const jsonPath =
    process.env.SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON_PATH ||
    '.secrets/search-console-service-account.json';
  const resolvedPath = path.resolve(process.cwd(), jsonPath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(
      `No se encontró el JSON del service account en ${resolvedPath}.`
    );
  }

  return JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
}

async function getClient() {
  const credentials = getJsonCredentials();
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });

  return auth.getClient();
}

async function run() {
  const property = process.env.SEARCH_CONSOLE_PROPERTY || DEFAULT_PROPERTY;
  const rows = Number(process.env.SEARCH_CONSOLE_ROWS || '25');
  const days = Number(process.env.SEARCH_CONSOLE_DAYS || '30');
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const authClient = await getClient();
  const searchconsole = google.searchconsole({
    version: 'v1',
    auth: authClient,
  });

  const response = await searchconsole.searchanalytics.query({
    siteUrl: property,
    requestBody: {
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      dimensions: ['page', 'query'],
      rowLimit: rows,
    },
  });

  const result = {
    property,
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
    rows: response.data.rows || [],
  };

  console.log(JSON.stringify(result, null, 2));
}

run().catch((error) => {
  console.error('Error consultando Search Console:', error.message);
  process.exit(1);
});
