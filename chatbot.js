// ⚙️ CONFIGURATION
const WEBHOOK_URL = 'https://votre-webhook-n8n.com/webhook/chatbruti';

// État
let isProcessing = false;

// Éléments DOM
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const chatbotButton = document.getElementById('chatbotButton');
const chatbotWindow = document.getElementById('chatbotWindow');
const closeButton = document.getElementById('closeButton');

// Indicateur de frappe
const typingIndicator = document.createElement('div');
typingIndicator.className = 'message bot';
typingIndicator.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="typing-indicator">
        <span></span><span></span><span></span>
    </div>
`;

// --- Fonctions Utilitaires ---

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function notifyParent(state) {
    // Envoie un message à la fenêtre parente (celle qui contient l'iframe)
    window.parent.postMessage({ type: state }, '*');
}

// --- Fonctions d'Affichage ---

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    const avatar = sender === 'user' ? '👤' : '🐱';

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-bubble">${escapeHtml(text)}</div>
    `;

    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function addErrorMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message error';
    messageDiv.innerHTML = `
        <div class="message-avatar">⚠️</div>
        <div class="message-bubble">${escapeHtml(text)}</div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    chatMessages.appendChild(typingIndicator);
    typingIndicator.querySelector('.typing-indicator').classList.add('active');
    scrollToBottom();
}

function hideTypingIndicator() {
    typingIndicator.querySelector('.typing-indicator').classList.remove('active');
    if (typingIndicator.parentNode) {
        typingIndicator.parentNode.removeChild(typingIndicator);
    }
}

// --- Logique Métier ---

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message || isProcessing) return;

    isProcessing = true;
    sendButton.disabled = true;
    userInput.disabled = true;

    addMessage(message, 'user');
    userInput.value = '';
    showTypingIndicator();

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                systemPrompt: "Tu es Chat'Bruti..."
            })
        });

        hideTypingIndicator();

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        if (data.reply) {
            addMessage(data.reply, 'bot');
        } else {
            throw new Error('Réponse invalide');
        }

    } catch (error) {
        hideTypingIndicator();
        console.error('Erreur:', error);
        addErrorMessage('Le Chat\'Bruti dort. Réessayez plus tard !');
    } finally {
        isProcessing = false;
        sendButton.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }
}

function openChat() {
    chatbotWindow.classList.add('active');
    chatbotButton.classList.add('open');
    userInput.focus();
    notifyParent('chatbot-opened');
}

function closeChat() {
    chatbotWindow.classList.remove('active');
    chatbotButton.classList.remove('open');
    notifyParent('chatbot-closed');
}

// --- Event Listeners ---

sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Bouton flottant (Ouvrir)
chatbotButton.addEventListener('click', openChat);

// Bouton de fermeture (Fermer)
if (closeButton) {
    closeButton.addEventListener('click', closeChat);
}

// Touche Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatbotWindow.classList.contains('active')) {
        closeChat();
    }
});

// Signal Prêt
window.addEventListener('load', () => {
    notifyParent('chatbruti-ready');
});
