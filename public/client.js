// client.js

const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

/**
 * Add message to chat box
 * @param {'user' | 'bot'} sender
 * @param {string} text
 */
function addMessage(sender, text) {
  const messageEl = document.createElement('div');
  messageEl.classList.add('message', sender);
  messageEl.textContent = text;
  chatBox.appendChild(messageEl);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Remove last bot message (e.g. loading indicator)
 */
function removeLastBotMessage() {
  const botMessages = [...chatBox.querySelectorAll('.message.bot')];
  if (botMessages.length > 0) {
    botMessages[botMessages.length - 1].remove();
  }
}

/**
 * Send user question to API and show response
 * @param {string} question
 */
async function sendQuestion(question) {
  addMessage('bot', 'Loading...');
  try {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();
    removeLastBotMessage();

    if (response.ok && data.answer) {
      addMessage('bot', data.answer);
    } else {
      addMessage('bot', 'Sorry, no answer found.');
    }
  } catch (error) {
    removeLastBotMessage();
    addMessage('bot', 'Server error. Please try again.');
    console.error('Fetch error:', error);
  }
}

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const question = userInput.value.trim();
  if (!question) return;

  addMessage('user', question);
  userInput.value = '';
  sendQuestion(question);
});
