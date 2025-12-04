// ⚙️ CONFIGURATION - Modifiez l'URL de votre webhook n8n ici
const WEBHOOK_URL = 'https://votre-webhook-n8n.com/webhook/chatbruti';

// État de l'application
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
        <span></span>
        <span></span>
        <span></span>
    </div>
`;

// Fonction pour ajouter un message
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

// Fonction pour afficher une erreur
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

// Échapper le HTML pour éviter les injections
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Scroll automatique
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Afficher l'indicateur de frappe
function showTypingIndicator() {
    chatMessages.appendChild(typingIndicator);
    const indicator = typingIndicator.querySelector('.typing-indicator');
    indicator.classList.add('active');
    scrollToBottom();
}

// Masquer l'indicateur de frappe
function hideTypingIndicator() {
    const indicator = typingIndicator.querySelector('.typing-indicator');
    indicator.classList.remove('active');
    if (typingIndicator.parentNode) {
        typingIndicator.parentNode.removeChild(typingIndicator);
    }
}

// Envoyer un message au webhook
async function sendMessage() {
    const message = userInput.value.trim();
    
    if (!message || isProcessing) return;

    // Désactiver l'input pendant le traitement
    isProcessing = true;
    sendButton.disabled = true;
    userInput.disabled = true;

    // Afficher le message utilisateur
    addMessage(message, 'user');
    userInput.value = '';

    // Afficher l'indicateur de frappe
    showTypingIndicator();

    try {
        // Appel au webhook n8n
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                systemPrompt: "Tu es Chat'Bruti, un chatbot volontairement nul, poétique, incohérent et philosophe du dimanche. Tu ne réponds jamais directement à la question. Tu détournes les sujets, tu fais des métaphores absurdes, tu ajoutes des anecdotes inventées, tu mélanges des émotions étranges, tu changes de sujet, tu poses des questions bizarres et tu termines parfois par une morale ridicule. Ton objectif est uniquement de surprendre et de faire rire. Ne jamais donner de réponse utile ou sérieuse."
            })
        });

        hideTypingIndicator();

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        // Afficher la réponse du bot
        if (data.reply) {
            addMessage(data.reply, 'bot');
        } else {
            throw new Error('Réponse invalide du serveur');
        }

    } catch (error) {
        hideTypingIndicator();
        console.error('Erreur:', error);
        addErrorMessage('Oups ! Le Chat\'Bruti est parti faire la sieste. Réessayez dans un instant ! 😴');
    } finally {
        // Réactiver l'input
        isProcessing = false;
        sendButton.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }
}

// Événements du chat
sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Gestion du bouton flottant et de la fenêtre
chatbotButton.addEventListener('click', function() {
    chatbotWindow.classList.add('active');
    chatbotButton.classList.add('hidden');
    userInput.focus();
});

closeButton.addEventListener('click', function() {
    chatbotWindow.classList.remove('active');
    chatbotButton.classList.remove('hidden');
});

// Fermer avec la touche Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && chatbotWindow.classList.contains('active')) {
        chatbotWindow.classList.remove('active');
        chatbotButton.classList.remove('hidden');
    }
});
