chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'showTooltip') {
    createTooltip(message.text);
  }
});

function createTooltip(selectedText) {
  const tooltip = document.createElement('div');
  tooltip.id = 'rewriteTooltip';
  tooltip.style.position = 'fixed';
  tooltip.style.top = '10px';
  tooltip.style.right = '10px';
  tooltip.style.backgroundColor = '#fff';
  tooltip.style.border = '1px solid #ccc';
  tooltip.style.padding = '8px';
  tooltip.style.zIndex = '9999';

  const label = document.createElement('label');
  label.htmlFor = 'textType';
  label.innerText = 'Type of Text: ';
  tooltip.appendChild(label);

  const select = document.createElement('select');
  select.id = 'textType';
  const option1 = document.createElement('option');
  option1.innerText = 'Product Title';
  const option2 = document.createElement('option');
  option2.innerText = 'Product Description';
  const option3 = document.createElement('option');
  option3.innerText = 'Other';
  select.appendChild(option1);
  select.appendChild(option2);
  select.appendChild(option3);
  tooltip.appendChild(select);

  const button = document.createElement('button');
  button.innerText = 'Rewrite';
  tooltip.appendChild(button);

  const rewrittenTextDiv = document.createElement('div');
  rewrittenTextDiv.id = 'rewrittenText';
  tooltip.appendChild(rewrittenTextDiv);

  button.addEventListener('click', () => {
    const textType = select.value;
    const text = selectedText;
    const prompt = `Rewrite the following ${textType} to optimize it for SEO and keywords so they show up well on Amazon. Output only the rewritten text:\n${text}`;

    chrome.runtime.sendMessage({ action: 'rewriteText', prompt }, (response) => {
      rewrittenTextDiv.innerText = response.rewrittenText;
    });
  });

  document.body.appendChild(tooltip);
}

document.addEventListener('mouseup', (event) => {
  const selection = window.getSelection().toString().trim();
  if (selection) {
    chrome.runtime.sendMessage({ action: 'showTooltip', text: selection });
  }
});
