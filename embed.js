/**
 * Chat'Bruti Embed Script
 * Intégration "Invisible Overlay" avec Clip-Path pour une interactivité parfaite.
 */
(function (window, document) {
    'use strict';

    // Configuration par défaut
    const DEFAULT_CONFIG = {
        // URL de votre chatbot (à remplacer par l'URL GitHub Pages finale)
        chatbotUrl: 'https://azizbelhadjsayar.github.io/test-chat/',
        // chatbotUrl: 'http://localhost:5500/index.html', // Pour le dev local
    };

    class ChatbotWidget {
        constructor(config = {}) {
            this.config = { ...DEFAULT_CONFIG, ...config };
            this.iframe = null;
            this.init();
        }

        init() {
            if (document.getElementById('chatbruti-widget')) {
                return; // Déjà initialisé
            }
            this.createIframe();
            this.setupEventListeners();
        }

        createIframe() {
            this.iframe = document.createElement('iframe');
            this.iframe.id = 'chatbruti-widget';
            this.iframe.src = this.config.chatbotUrl;

            // Styles pour l'iframe
            // On utilise clip-path pour ne rendre cliquable que la zone du bouton au début
            const styles = {
                position: 'fixed',
                bottom: '0',
                right: '0',
                width: '450px', // Assez large pour la fenêtre ouverte
                height: '750px', // Assez haut pour la fenêtre ouverte
                border: 'none',
                margin: '0',
                padding: '0',
                overflow: 'hidden',
                zIndex: '999999',
                // Au début, on ne montre que le coin en bas à droite (le bouton)
                // inset(top right bottom left)
                // On cache tout sauf les 100 derniers pixels en bas et à droite
                clipPath: 'inset(calc(100% - 100px) 0 0 calc(100% - 100px))',
                transition: 'clip-path 0.3s ease-in-out', // Animation fluide de la zone cliquable
                pointerEvents: 'auto', // L'iframe capture les clics, mais clip-path limite la zone
                background: 'transparent',
                colorScheme: 'normal'
            };

            Object.assign(this.iframe.style, styles);

            // Accessibilité
            this.iframe.setAttribute('title', 'Chatbot Widget');
            this.iframe.setAttribute('aria-hidden', 'false');

            document.body.appendChild(this.iframe);
        }

        setupEventListeners() {
            window.addEventListener('message', (event) => {
                // Gestion de l'ouverture/fermeture pour agrandir la zone cliquable
                if (event.data && event.data.type === 'chatbot-opened') {
                    // On rend toute l'iframe visible/cliquable
                    this.iframe.style.clipPath = 'inset(0 0 0 0)';
                } else if (event.data && event.data.type === 'chatbot-closed') {
                    // On revient à la zone du bouton uniquement
                    this.iframe.style.clipPath = 'inset(calc(100% - 100px) 0 0 calc(100% - 100px))';
                }
            });
        }
    }

    // Exposer globalement
    window.ChatBruti = {
        init: (config) => new ChatbotWidget(config)
    };

    // Auto-initialisation
    const userConfig = window.ChatBrutiConfig || {};

    // Dev local override
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        userConfig.chatbotUrl = 'http://localhost:5500/index.html';
    }

    window.ChatBruti.init(userConfig);

})(window, document);
