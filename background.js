chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'rewriteText',
    title: 'Rewrite using AI',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'rewriteText') {
    const selectedText = info.selectionText;
    chrome.storage.local.set({ selectedText }, () => {
      chrome.windows.create({
        url: 'popup.html',
        type: 'popup',
        width: 400,
        height: 600,
      });
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'rewriteText') {
    const prompt = message.prompt;
    const selectedText = message.text;
    rewriteTextUsingAI(selectedText, prompt)
      .then((rewrittenText) => {
        sendResponse({ rewrittenText });
      })
      .catch((error) => {
        console.error('Error:', error);
        sendResponse({ rewrittenText: 'Error occurred. Please try again.' });
      });
    return true;
  }
});

async function rewriteTextUsingAI(text, prompt) {
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
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  const rewrittenText = data.choices[0].text.trim();

  return rewrittenText;
}
