(function (window, document) {
    'use strict';

    const DEFAULT_CONFIG = {
        chatbotUrl: 'https://azizbelhadjsayar.github.io/test-chat/',
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

            const width = '400px';
            const height = '450px';

            const styles = {
                position: 'fixed',
                bottom: '0',
                right: '0',
                width: width,
                height: height,
                border: 'none',
                zIndex: '999999',
                clipPath: 'inset(calc(100% - 100px) 0 0 calc(100% - 100px))',
                transition: 'clip-path 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                pointerEvents: 'auto',
                background: 'transparent',
                colorScheme: 'normal',
                borderRadius: '20px',
            };

            Object.assign(this.iframe.style, styles);

            this.iframe.setAttribute('title', 'Chatbot');
            this.iframe.setAttribute('allow', 'clipboard-write');

            document.body.appendChild(this.iframe);
        }

        setupEventListeners() {
            window.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'chatbot-opened') {
                    this.iframe.style.clipPath = 'inset(0 0 0 0)';
                } else if (event.data && event.data.type === 'chatbot-closed') {
                    this.iframe.style.clipPath = 'inset(calc(100% - 100px) 0 0 calc(100% - 100px))';
                }
            });
        }
    }

    const userConfig = window.ChatBrutiConfig || {};

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        userConfig.chatbotUrl = 'http://localhost:5500/index.html';
    }

    window.ChatBruti = new ChatbotWidget(userConfig);

})(window, document);
