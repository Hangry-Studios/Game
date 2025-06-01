const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const OPENROUTER_API_KEY = "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";

  try {
    const body = JSON.parse(event.body);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
