const form = document.getElementById('astro-form');
const resultDiv = document.getElementById('result');

// Replace these with your actual credentials
const CLIENT_ID = '<YOUR_CLIENT_ID>';
const CLIENT_SECRET = '<YOUR_CLIENT_SECRET>';
let accessToken = '';

// Fetch the access token
async function getAccessToken() {
  const response = await fetch('https://api.prokerala.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
  });
  const data = await response.json();
  accessToken = data.access_token;
}

// Fetch astrology data
async function getAstrologyData(coordinates, datetime) {
  const url = `https://api.prokerala.com/v2/astrology/kundli?ayanamsa=1&coordinates=${coordinates}&datetime=${datetime}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await response.json();
  return data;
}

// Handle form submission
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const coordinates = document.getElementById('coordinates').value;
  const datetime = document.getElementById('datetime').value;

  if (!accessToken) {
    await getAccessToken();
  }

  try {
    const astrologyData = await getAstrologyData(coordinates, datetime);
    resultDiv.innerHTML = `<pre>${JSON.stringify(astrologyData, null, 2)}</pre>`;
  } catch (error) {
    resultDiv.innerHTML = `<p>Error fetching astrology data. Please try again.</p>`;
  }
});