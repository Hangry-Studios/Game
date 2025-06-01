<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>OpenRouter Quiz</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      background: #222;
      color: #eee;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 2rem;
    }
    #question {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      max-width: 600px;
      text-align: center;
    }
    #answerInput {
      font-size: 1.2rem;
      padding: 0.5rem;
      width: 300px;
      max-width: 90vw;
      margin-bottom: 1rem;
    }
    #submitBtn {
      font-size: 1.2rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
    #status {
      margin-top: 1rem;
      min-height: 1.5rem;
    }
  </style>
</head>
<body>
  <h1>OpenRouter Quiz</h1>
  <div id="question">Laddar fråga...</div>
  <input id="answerInput" placeholder="Skriv ditt svar här" autocomplete="off" />
  <button id="submitBtn">Skicka svar</button>
  <div id="status"></div>

  <script>
    const questionEl = document.getElementById('question');
    const answerInput = document.getElementById('answerInput');
    const submitBtn = document.getElementById('submitBtn');
    const statusEl = document.getElementById('status');

    async function fetchQuestion() {
      questionEl.textContent = 'Laddar fråga...';
      statusEl.textContent = '';
      answerInput.value = '';
      try {
        const response = await fetch('/.netlify/functions/openrouter-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: "Ställ en kort, enkel quizfråga på svenska med svar.",
            max_tokens: 100
          })
        });
        if (!response.ok) throw new Error('Något gick fel');
        const data = await response.json();
        const text = data.choices?.[0]?.text?.trim() || 'Ingen fråga från API';
        questionEl.textContent = text;
      } catch (err) {
        questionEl.textContent = 'Kunde inte hämta fråga.';
        console.error(err);
      }
    }

    submitBtn.onclick = () => {
      statusEl.textContent = 'Tack för ditt svar!';
      setTimeout(fetchQuestion, 2000); // Hämta ny fråga efter 2 sek
    };

    // Ladda första fråga direkt
    fetchQuestion();
  </script>
</body>
</html>