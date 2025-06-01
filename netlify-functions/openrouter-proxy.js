const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    return { statusCode: 500, body: 'API-nyckel saknas' };
  }

  try {
    const body = JSON.parse(event.body);

    const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openrouter-gpt-3-large',
        messages: [{ role: 'user', content: body.prompt }],
        max_tokens: body.max_tokens || 100,
      }),
    });

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      return { statusCode: apiResponse.status, body: `OpenRouter error: ${errText}` };
    }

    const json = await apiResponse.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(json),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: `Server error: ${error.message}`
    };
  }
};