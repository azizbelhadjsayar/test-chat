/**
 * Chat'Bruti Embed Script
 * Intégration "Clip-Path Overlay" pour une interactivité parfaite.
 */
(function (window, document) {
    'use strict';

    // Configuration
    const DEFAULT_CONFIG = {
        // ⚠️ REMPLACEZ PAR VOTRE URL GITHUB PAGES FINALE
        chatbotUrl: 'https://azizbelhadjsayar.github.io/test-chat/',
        // chatbotUrl: 'http://localhost:5500/index.html', // Dev local
    };

    class ChatbotWidget {
        constructor(config = {}) {
            this.config = { ...DEFAULT_CONFIG, ...config };
            this.iframe = null;
            this.init();
        }

        init() {
            if (document.getElementById('chatbruti-widget')) return;
            this.createIframe();
            this.setupEventListeners();
        }

        createIframe() {
            this.iframe = document.createElement('iframe');
            this.iframe.id = 'chatbruti-widget';
            this.iframe.src = this.config.chatbotUrl;

            // Dimensions de la zone active (Bouton + Fenêtre)
            // On prend large pour être sûr
            const width = '450px';
            const height = '750px';

            const styles = {
                position: 'fixed',
                bottom: '0',
                right: '0',
                width: width,
                height: height,
                border: 'none',
                zIndex: '999999',
                // Clip-path initial: on ne montre que le bouton (60x60 + marges 20px = ~100px)
                // inset(top right bottom left)
                // On cache tout sauf le coin en bas à droite
                clipPath: 'inset(calc(100% - 100px) 0 0 calc(100% - 100px))',
                transition: 'clip-path 0.4s cubic-bezier(0.25, 1, 0.5, 1)', // Animation fluide
                pointerEvents: 'auto', // L'iframe capture les clics
                background: 'transparent',
                colorScheme: 'normal'
            };

            Object.assign(this.iframe.style, styles);

            // Accessibilité
            this.iframe.setAttribute('title', 'Chatbot');
            this.iframe.setAttribute('allow', 'clipboard-write'); // Utile si besoin de copier/coller

            document.body.appendChild(this.iframe);
        }

        setupEventListeners() {
            window.addEventListener('message', (event) => {
                // Gestion ouverture/fermeture
                if (event.data && event.data.type === 'chatbot-opened') {
                    // On montre tout
                    this.iframe.style.clipPath = 'inset(0 0 0 0)';
                } else if (event.data && event.data.type === 'chatbot-closed') {
                    // On revient au bouton
                    this.iframe.style.clipPath = 'inset(calc(100% - 100px) 0 0 calc(100% - 100px))';
                }
            });
        }
    }

    // Init
    const userConfig = window.ChatBrutiConfig || {};

    // Auto-detect local dev
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        userConfig.chatbotUrl = 'http://localhost:5500/index.html';
    }

    window.ChatBruti = new ChatbotWidget(userConfig);

})(window, document);
