document.addEventListener('DOMContentLoaded', async () => {
  const selectedText = await getSelectedText();
  document.getElementById('highlightedText').textContent = selectedText;
});

document.getElementById('rewriteButton').addEventListener('click', async () => {
  const selectedText = await getSelectedText();
  const textType = document.getElementById('textType').value;
  const prompt = `Rewrite the following ${textType} to optimize it for SEO and keywords so they show up well on Amazon. Output only the rewritten ${textType}.`;

  const response = await rewriteText(selectedText, prompt);
  document.getElementById('rewrittenText').textContent = response.rewrittenText;
});

async function getSelectedText() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['selectedText'], (result) => {
      resolve(result.selectedText || '');
    });
  });
}

async function rewriteText(text, prompt) {
  const apiKey = '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';
  const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';

  const body = {
    prompt,
    max_tokens: 100,
    temperature: 0.7,
    top_p: 1.0,
    n: 1,
    stop: '\n',
    texts: [text],
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  const rewrittenText = data.choices[0].text.trim();

  return { rewrittenText };
}
