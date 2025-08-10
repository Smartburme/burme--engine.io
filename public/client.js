// client.js

const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

/**
 * Scroll chat box to bottom smoothly
 */
function scrollToBottom() {
  chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
}

/**
 * Create and append message element
 * @param {'user' | 'bot'} sender
 * @param {string} text
 */
function appendMessage(sender, text) {
  const messageEl = document.createElement('div');
  messageEl.classList.add('message', sender);
  messageEl.textContent = text;
  chatBox.appendChild(messageEl);
  scrollToBottom();
}

/**
 * Remove last bot message (e.g. loading message)
 */
function removeLastBotMessage() {
  const botMessages = Array.from(chatBox.querySelectorAll('.message.bot'));
  if (botMessages.length > 0) {
    botMessages[botMessages.length - 1].remove();
  }
}

/**
 * Send question to backend API and handle response
 * @param {string} question
 */
async function sendQuestion(question) {
  appendMessage('bot', 'Loading...');

  try {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    removeLastBotMessage();

    if (data.answer) {
      appendMessage('bot', data.answer);
    } else {
      appendMessage('bot', 'Sorry, no answer available.');
    }
  } catch (error) {
    removeLastBotMessage();
    appendMessage('bot', 'Error: Unable to get response. Please try again later.');
    console.error('Fetch error:', error);
  }
}

/**
 * Handle form submission
 */
chatForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const question = userInput.value.trim();
  if (!question) return;

  appendMessage('user', question);
  userInput.value = '';
  sendQuestion(question);
});

/**
 * Accessibility: focus on input on page load
 */
window.addEventListener('DOMContentLoaded', () => {
  userInput.focus();
});
