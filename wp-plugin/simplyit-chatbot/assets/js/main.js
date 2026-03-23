(() => {
    const CHAT_POSITION = 'right';
    const CHAT_HORIZONTAL_OFFSET_DESKTOP = 50;
    const CHAT_HORIZONTAL_OFFSET_MOBILE = 16;
    const CHAT_FAB_VERTICAL_OFFSET_DESKTOP = 50;
    const CHAT_FAB_VERTICAL_OFFSET_MOBILE = 20;
    const CHAT_WINDOW_FAB_GAP_DESKTOP = 72;
    const CHAT_WINDOW_FAB_GAP_MOBILE = 60;
    const CHAT_COLOR = '#dd3a0a';
    const FAB_LABEL = 'Need help?';
    const FAB_SUBTITLE = 'AI Assistant';
    const FAB_PULSE_ENABLED = true;
    const TYPING_ANIMATION_ENABLED = true;
    const TYPING_SPEED = 2;
    const HEADER_LABEL = 'S.A.M (Simply Ask Me)';
    const USER_BUBBLE_COLOR = '#3d2e2e';
    const USER_TEXT_COLOR = '#ffffff';
    const WELCOME_MESSAGE = 'Hi! I am SAM, how may I be of assistance?\n Have any questions about SimplyIT?\n Or would you like to book a free audit for your business?';
    const CHAT_STORAGE_KEY = 'chatbot_history';
    const CHAT_ID_STORAGE_KEY = 'chatId';

    const template = `
        <div id="simplyit-chatbot">
            <button id="chat-fab" type="button" style="visibility: hidden;" class="simplyit-chatbot-fixed simplyit-chatbot-bottom-6 simplyit-chatbot-right-6 simplyit-chatbot-z-40 simplyit-chatbot-inline-flex simplyit-chatbot-items-center simplyit-chatbot-gap-2 simplyit-chatbot-rounded-full simplyit-chatbot-bg-indigo-600 simplyit-chatbot-px-4 simplyit-chatbot-py-3 simplyit-chatbot-text-white simplyit-chatbot-shadow-lg simplyit-chatbot-shadow-indigo-600/30 hover:simplyit-chatbot-bg-indigo-500 focus:simplyit-chatbot-outline-none focus:simplyit-chatbot-ring-4 focus:simplyit-chatbot-ring-indigo-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="simplyit-chatbot-size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
                <div class="simplyit-chatbot-flex simplyit-chatbot-flex-col simplyit-chatbot-items-start">
                    <span id="chat-fab-label" class="simplyit-chatbot-font-medium simplyit-chatbot-text-sm simplyit-chatbot-leading-tight"></span>
                    <span id="chat-fab-subtitle" class="simplyit-chatbot-text-xs simplyit-chatbot-opacity-80 simplyit-chatbot-leading-tight"></span>
                </div>
                <span class="simplyit-chatbot-sr-only">Open chat</span>
            </button>

            <div id="chat-window" class="simplyit-chatbot-fixed simplyit-chatbot-bottom-24 simplyit-chatbot-right-6 simplyit-chatbot-z-40 simplyit-chatbot-w-[92vw] simplyit-chatbot-max-w-lg simplyit-chatbot-rounded-2xl simplyit-chatbot-border simplyit-chatbot-border-slate-200 simplyit-chatbot-bg-white simplyit-chatbot-shadow-xl simplyit-chatbot-transition-all simplyit-chatbot-duration-300 simplyit-chatbot-opacity-0 simplyit-chatbot-scale-95 simplyit-chatbot-pointer-events-none" style="visibility: hidden;">
                <div id="chat-skeleton" class="simplyit-chatbot-flex simplyit-chatbot-flex-col simplyit-chatbot-h-full">
                    <div class="simplyit-chatbot-flex simplyit-chatbot-items-center simplyit-chatbot-justify-between simplyit-chatbot-relative simplyit-chatbot-rounded-t-2xl simplyit-chatbot-bg-indigo-600 simplyit-chatbot-px-4 simplyit-chatbot-py-3">
                        <div class="simplyit-chatbot-flex simplyit-chatbot-items-center simplyit-chatbot-gap-3">
                            <div class="simplyit-chatbot-h-9 simplyit-chatbot-w-9 simplyit-chatbot-rounded-full simplyit-chatbot-bg-white/20 simplyit-chatbot-animate-pulse"></div>
                            <div class="simplyit-chatbot-flex simplyit-chatbot-flex-col simplyit-chatbot-gap-1">
                                <div class="simplyit-chatbot-h-3 simplyit-chatbot-w-24 simplyit-chatbot-rounded simplyit-chatbot-bg-white/20 simplyit-chatbot-animate-pulse"></div>
                                <div class="simplyit-chatbot-h-2 simplyit-chatbot-w-16 simplyit-chatbot-rounded simplyit-chatbot-bg-white/20 simplyit-chatbot-animate-pulse"></div>
                            </div>
                        </div>
                        <div class="simplyit-chatbot-flex simplyit-chatbot-items-center simplyit-chatbot-gap-1">
                            <div class="simplyit-chatbot-rounded-lg simplyit-chatbot-p-2 simplyit-chatbot-bg-white/10 simplyit-chatbot-animate-pulse simplyit-chatbot-h-8 simplyit-chatbot-w-8"></div>
                            <div class="simplyit-chatbot-rounded-lg simplyit-chatbot-p-2 simplyit-chatbot-bg-white/10 simplyit-chatbot-animate-pulse simplyit-chatbot-h-8 simplyit-chatbot-w-8 simplyit-chatbot-hidden sm:simplyit-chatbot-block"></div>
                            <div class="simplyit-chatbot-rounded-lg simplyit-chatbot-p-2 simplyit-chatbot-bg-white/10 simplyit-chatbot-animate-pulse simplyit-chatbot-h-8 simplyit-chatbot-w-8"></div>
                        </div>
                    </div>
                    <div class="simplyit-chatbot-flex-1 simplyit-chatbot-h-[28rem] simplyit-chatbot-overflow-y-auto simplyit-chatbot-bg-slate-50 simplyit-chatbot-p-3 simplyit-chatbot-space-y-3">
                        <div class="simplyit-chatbot-flex simplyit-chatbot-items-end simplyit-chatbot-gap-2">
                            <div class="simplyit-chatbot-h-8 simplyit-chatbot-w-8 simplyit-chatbot-rounded-full simplyit-chatbot-bg-indigo-200 simplyit-chatbot-animate-pulse"></div>
                            <div class="simplyit-chatbot-bg-indigo-100 simplyit-chatbot-rounded-2xl simplyit-chatbot-rounded-bl-md simplyit-chatbot-p-3 simplyit-chatbot-space-y-2 simplyit-chatbot-max-w-[70%]">
                                <div class="simplyit-chatbot-h-3 simplyit-chatbot-w-32 simplyit-chatbot-rounded simplyit-chatbot-bg-indigo-200 simplyit-chatbot-animate-pulse"></div>
                                <div class="simplyit-chatbot-h-3 simplyit-chatbot-w-24 simplyit-chatbot-rounded simplyit-chatbot-bg-indigo-200 simplyit-chatbot-animate-pulse"></div>
                            </div>
                        </div>
                        <div class="simplyit-chatbot-flex simplyit-chatbot-items-end simplyit-chatbot-gap-2 simplyit-chatbot-justify-end">
                            <div class="simplyit-chatbot-bg-indigo-600 simplyit-chatbot-rounded-2xl simplyit-chatbot-rounded-br-md simplyit-chatbot-p-3 simplyit-chatbot-space-y-2 simplyit-chatbot-max-w-[70%]">
                                <div class="simplyit-chatbot-h-3 simplyit-chatbot-w-28 simplyit-chatbot-rounded simplyit-chatbot-bg-indigo-400 simplyit-chatbot-animate-pulse"></div>
                                <div class="simplyit-chatbot-h-3 simplyit-chatbot-w-20 simplyit-chatbot-rounded simplyit-chatbot-bg-indigo-400 simplyit-chatbot-animate-pulse"></div>
                            </div>
                        </div>
                        <div class="simplyit-chatbot-flex simplyit-chatbot-items-end simplyit-chatbot-gap-2">
                            <div class="simplyit-chatbot-h-8 simplyit-chatbot-w-8 simplyit-chatbot-rounded-full simplyit-chatbot-bg-indigo-200 simplyit-chatbot-animate-pulse"></div>
                            <div class="simplyit-chatbot-bg-indigo-100 simplyit-chatbot-rounded-2xl simplyit-chatbot-rounded-bl-md simplyit-chatbot-p-3 simplyit-chatbot-space-y-2 simplyit-chatbot-max-w-[70%]">
                                <div class="simplyit-chatbot-h-3 simplyit-chatbot-w-36 simplyit-chatbot-rounded simplyit-chatbot-bg-indigo-200 simplyit-chatbot-animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                    <div class="simplyit-chatbot-flex simplyit-chatbot-items-end simplyit-chatbot-gap-2 simplyit-chatbot-border-t simplyit-chatbot-border-slate-200 simplyit-chatbot-bg-white simplyit-chatbot-px-3 simplyit-chatbot-py-3">
                        <div class="simplyit-chatbot-flex-1 simplyit-chatbot-h-10 simplyit-chatbot-rounded-xl simplyit-chatbot-border simplyit-chatbot-border-slate-200 simplyit-chatbot-bg-slate-50 simplyit-chatbot-animate-pulse"></div>
                        <div class="simplyit-chatbot-h-10 simplyit-chatbot-w-16 simplyit-chatbot-rounded-xl simplyit-chatbot-bg-indigo-600 simplyit-chatbot-animate-pulse"></div>
                    </div>
                </div>
                <div id="chat-content" class="simplyit-chatbot-hidden simplyit-chatbot-flex simplyit-chatbot-flex-col simplyit-chatbot-h-full">
                    <div class="simplyit-chatbot-flex simplyit-chatbot-items-center simplyit-chatbot-justify-between simplyit-chatbot-relative simplyit-chatbot-rounded-t-2xl simplyit-chatbot-bg-indigo-600 simplyit-chatbot-px-4 simplyit-chatbot-py-3 simplyit-chatbot-text-white">
                        <div class="simplyit-chatbot-flex simplyit-chatbot-items-center simplyit-chatbot-gap-3">
                            <div class="simplyit-chatbot-flex simplyit-chatbot-h-9 simplyit-chatbot-w-9 simplyit-chatbot-items-center simplyit-chatbot-justify-center simplyit-chatbot-rounded-full simplyit-chatbot-bg-white/20">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="simplyit-chatbot-size-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                                </svg>
                            </div>
                            <div class="simplyit-chatbot-flex simplyit-chatbot-flex-col">
                                <p id="header-label" class="simplyit-chatbot-text-sm simplyit-chatbot-leading-tight simplyit-chatbot-opacity-90"></p>
                                <p id="header-subtitle" class="simplyit-chatbot-text-xs simplyit-chatbot-leading-tight simplyit-chatbot-opacity-70"></p>
                            </div>
                        </div>
                        <div id="error-snackbar" class="simplyit-chatbot-hidden simplyit-chatbot-absolute simplyit-chatbot-top-full simplyit-chatbot-left-0 simplyit-chatbot-right-0 simplyit-chatbot-z-50 simplyit-chatbot-bg-red-500 simplyit-chatbot-text-white simplyit-chatbot-px-4 simplyit-chatbot-py-3 simplyit-chatbot-text-sm simplyit-chatbot-shadow-lg simplyit-chatbot-transition-all simplyit-chatbot-duration-300 simplyit-chatbot-transform -simplyit-chatbot-translate-y-full simplyit-chatbot-opacity-0">
                            <div class="simplyit-chatbot-flex simplyit-chatbot-items-center simplyit-chatbot-justify-between">
                                <div class="simplyit-chatbot-flex simplyit-chatbot-items-center simplyit-chatbot-gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="simplyit-chatbot-h-5 simplyit-chatbot-w-5 simplyit-chatbot-flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                    <span id="error-message" class="simplyit-chatbot-font-medium"></span>
                                </div>
                                <button id="error-dismiss" class="simplyit-chatbot-ml-4 simplyit-chatbot-p-1 hover:simplyit-chatbot-bg-red-600 simplyit-chatbot-rounded simplyit-chatbot-transition-colors" title="Dismiss">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="simplyit-chatbot-h-5 simplyit-chatbot-w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="simplyit-chatbot-flex simplyit-chatbot-items-center simplyit-chatbot-gap-1">
                            <button id="chat-clear" class="simplyit-chatbot-tooltip simplyit-chatbot-rounded-lg simplyit-chatbot-p-2 hover:simplyit-chatbot-bg-white/10 focus:simplyit-chatbot-outline-none focus:simplyit-chatbot-ring-2 focus:simplyit-chatbot-ring-white/40" data-tooltip="Clear chat">
                                <svg xmlns="http://www.w3.org/2000/svg" class="simplyit-chatbot-h-5 simplyit-chatbot-w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6"/></svg>
                            </button>
                            <button id="chat-resize" class="simplyit-chatbot-tooltip simplyit-chatbot-rounded-lg simplyit-chatbot-p-2 hover:simplyit-chatbot-bg-white/10 focus:simplyit-chatbot-outline-none focus:simplyit-chatbot-ring-2 focus:simplyit-chatbot-ring-white/40 simplyit-chatbot-hidden sm:simplyit-chatbot-block" data-tooltip="Make chat bigger">
                                <svg xmlns="http://www.w3.org/2000/svg" class="simplyit-chatbot-h-5 simplyit-chatbot-w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                            </button>
                            <button id="chat-close" class="simplyit-chatbot-tooltip simplyit-chatbot-rounded-lg simplyit-chatbot-p-2 hover:simplyit-chatbot-bg-white/10 focus:simplyit-chatbot-outline-none focus:simplyit-chatbot-ring-2 focus:simplyit-chatbot-ring-white/40" data-tooltip="Close chat">
                                <svg xmlns="http://www.w3.org/2000/svg" class="simplyit-chatbot-h-5 simplyit-chatbot-w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                            </button>
                        </div>
                    </div>
                    <div id="chat-messages" class="simplyit-chatbot-nice-scrollbar simplyit-chatbot-h-[28rem] simplyit-chatbot-overflow-y-auto simplyit-chatbot-bg-slate-50 simplyit-chatbot-px-3 simplyit-chatbot-py-3"></div>
                    <form id="chat-form" class="simplyit-chatbot-flex simplyit-chatbot-items-end simplyit-chatbot-gap-2 simplyit-chatbot-border-t simplyit-chatbot-border-slate-200 simplyit-chatbot-bg-white simplyit-chatbot-px-3 simplyit-chatbot-py-3">
                        <div class="simplyit-chatbot-relative simplyit-chatbot-flex-1 simplyit-chatbot-self-center">
                            <textarea id="chat-input" rows="1" placeholder="Type a message..." class="simplyit-chatbot-nice-scrollbar simplyit-chatbot-max-h-32 simplyit-chatbot-w-full simplyit-chatbot-resize-none simplyit-chatbot-rounded-xl simplyit-chatbot-border simplyit-chatbot-border-slate-200 simplyit-chatbot-bg-white simplyit-chatbot-px-3 simplyit-chatbot-py-2 simplyit-chatbot-text-sm simplyit-chatbot-text-slate-800 simplyit-chatbot-placeholder-slate-400 simplyit-chatbot-shadow-sm simplyit-chatbot-outline-none simplyit-chatbot-transition focus:simplyit-chatbot-border-indigo-400 focus:simplyit-chatbot-ring-2 focus:simplyit-chatbot-ring-indigo-200"></textarea>
                            <div class="simplyit-chatbot-pointer-events-none simplyit-chatbot-absolute simplyit-chatbot-bottom-2 simplyit-chatbot-right-3 simplyit-chatbot-text-xs simplyit-chatbot-text-slate-400 simplyit-chatbot-hidden sm:simplyit-chatbot-block">Press Enter &#x21B5;</div>
                        </div>
                        <button id="chat-send" type="submit" class="simplyit-chatbot-inline-flex simplyit-chatbot-self-start simplyit-chatbot-items-center simplyit-chatbot-justify-center simplyit-chatbot-rounded-xl simplyit-chatbot-bg-indigo-600 simplyit-chatbot-px-3 simplyit-chatbot-py-2 simplyit-chatbot-text-sm simplyit-chatbot-font-medium simplyit-chatbot-text-white simplyit-chatbot-shadow-sm hover:simplyit-chatbot-bg-indigo-500 focus:simplyit-chatbot-outline-none focus:simplyit-chatbot-ring-4 focus:simplyit-chatbot-ring-indigo-200 disabled:simplyit-chatbot-cursor-not-allowed disabled:simplyit-chatbot-opacity-50 disabled:hover:simplyit-chatbot-bg-indigo-600 simplyit-chatbot-mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" class="simplyit-chatbot-mr-1 simplyit-chatbot-h-4 simplyit-chatbot-w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;

    function getHost() {
        return document.querySelector('#simplyit-chatbot-host, #simplyit-chatbot');
    }

    function detectAssets(host) {
        const assetsBase = host.dataset.assetsUrl || '';
        const isPluginAssets = /\/assets\/?$/.test(assetsBase);
        if (isPluginAssets) {
            return {
                imageBase: `${assetsBase}/img`,
                tailwindUrl: `${assetsBase}/css/tailwind.css`,
                chatbotUrl: `${assetsBase}/css/chatbot.css`,
            };
        }

        const base = assetsBase || '.';
        return {
            imageBase: `${base}/img`,
            tailwindUrl: `${base}/dist/tailwind.css`,
            chatbotUrl: `${base}/chatbot.css`,
        };
    }

    function escapeHtml(text) {
        return text
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: Number.parseInt(result[1], 16),
            g: Number.parseInt(result[2], 16),
            b: Number.parseInt(result[3], 16),
        } : null;
    }

    function generateChatId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const array = new Uint32Array(32);
        window.crypto.getRandomValues(array);
        let result = '';
        for (let i = 0; i < array.length; i += 1) {
            result += chars[array[i] % chars.length];
        }
        return result;
    }

    async function loadStylesheetText(url) {
        const response = await fetch(url, { credentials: 'same-origin' });
        if (!response.ok) {
            throw new Error(`Failed to load stylesheet: ${url}`);
        }
        return response.text();
    }

    function createShadowRoot(host, styles) {
        const shadowRoot = host.shadowRoot || host.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `<style>${styles}</style>${template}`;
        return shadowRoot;
    }

    function createWidgetState(shadowRoot, imageBase) {
        const state = {
            shadowRoot,
            widget: shadowRoot.getElementById('simplyit-chatbot'),
            windowEl: shadowRoot.getElementById('chat-window'),
            fab: shadowRoot.getElementById('chat-fab'),
            form: shadowRoot.getElementById('chat-form'),
            input: shadowRoot.getElementById('chat-input'),
            messages: shadowRoot.getElementById('chat-messages'),
            snackbar: shadowRoot.getElementById('error-snackbar'),
            errorMessage: shadowRoot.getElementById('error-message'),
            errorDismiss: shadowRoot.getElementById('error-dismiss'),
            fabLabel: shadowRoot.getElementById('chat-fab-label'),
            fabSubtitle: shadowRoot.getElementById('chat-fab-subtitle'),
            headerLabel: shadowRoot.getElementById('header-label'),
            headerSubtitle: shadowRoot.getElementById('header-subtitle'),
            sendBtn: shadowRoot.getElementById('chat-send'),
            skeleton: shadowRoot.getElementById('chat-skeleton'),
            content: shadowRoot.getElementById('chat-content'),
            imageBase,
            typingDotRgb: '99, 102, 241',
            isWaitingForResponse: false,
            chatHistory: [],
            chatId: localStorage.getItem(CHAT_ID_STORAGE_KEY) || generateChatId(),
        };
        localStorage.setItem(CHAT_ID_STORAGE_KEY, state.chatId);
        return state;
    }

    function applyLabels(state) {
        state.fabLabel.textContent = FAB_LABEL;
        state.fabSubtitle.textContent = FAB_SUBTITLE;
        state.headerLabel.textContent = HEADER_LABEL;
        state.headerSubtitle.textContent = FAB_SUBTITLE;
    }

    function applyChatColor(state, color) {
        const rgb = hexToRgb(color);
        if (!rgb) {
            return;
        }
        const rgbString = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
        state.typingDotRgb = rgbString;
        state.widget.style.setProperty('--chat-pulse-color', `rgba(${rgbString}, 0.4)`);
        state.fab.style.backgroundColor = color;
        state.fab.style.boxShadow = `0 10px 15px -3px rgba(${rgbString}, 0.3)`;
        state.sendBtn.style.backgroundColor = color;
        state.content.firstElementChild.style.backgroundColor = color;

        state.fab.addEventListener('mouseenter', () => {
            state.fab.style.backgroundColor = `rgba(${rgbString}, 0.9)`;
        });
        state.fab.addEventListener('mouseleave', () => {
            state.fab.style.backgroundColor = color;
        });
        state.sendBtn.addEventListener('mouseenter', () => {
            state.sendBtn.style.backgroundColor = `rgba(${rgbString}, 0.9)`;
        });
        state.sendBtn.addEventListener('mouseleave', () => {
            state.sendBtn.style.backgroundColor = color;
        });
        state.input.addEventListener('focus', () => {
            state.input.style.borderColor = color;
            state.input.style.boxShadow = `0 0 0 3px rgba(${rgbString}, 0.2)`;
        });
        state.input.addEventListener('blur', () => {
            state.input.style.borderColor = '#e2e8f0';
            state.input.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
        });
    }

    function setInitialVisibility(state) {
        state.skeleton.style.display = 'none';
        state.content.classList.remove('simplyit-chatbot-hidden');
        state.content.style.display = 'flex';
        state.fab.style.visibility = 'visible';
        state.windowEl.style.visibility = 'visible';
        if (FAB_PULSE_ENABLED) {
            state.fab.classList.add('chat-fab-pulse');
        }
    }

    function clearMobileViewportOverrides(state) {
        state.windowEl.style.removeProperty('top');
        state.windowEl.style.removeProperty('bottom');
        state.windowEl.style.removeProperty('height');
    }

    function handleKeyboard(state) {
        if (window.innerWidth >= 640 || !state.windowEl.classList.contains('chat-fullscreen') || !window.visualViewport) {
            return;
        }

        const viewportHeight = Math.max(0, Math.round(window.visualViewport.height));
        const viewportTop = Math.max(0, Math.round(window.visualViewport.offsetTop || 0));
        state.windowEl.style.setProperty('top', `${viewportTop}px`, 'important');
        state.windowEl.style.setProperty('height', `${viewportHeight}px`, 'important');
        state.windowEl.style.setProperty('bottom', 'auto', 'important');
    }

    function updatePositioning(state) {
        const isMobile = window.innerWidth < 640;
        const hOffset = isMobile ? CHAT_HORIZONTAL_OFFSET_MOBILE : CHAT_HORIZONTAL_OFFSET_DESKTOP;
        const fabVOffset = isMobile ? CHAT_FAB_VERTICAL_OFFSET_MOBILE : CHAT_FAB_VERTICAL_OFFSET_DESKTOP;
        const gap = isMobile ? CHAT_WINDOW_FAB_GAP_MOBILE : CHAT_WINDOW_FAB_GAP_DESKTOP;
        const winVOffset = fabVOffset + gap;
        const side = CHAT_POSITION;

        if (isMobile) {
            state.windowEl.style.setProperty('transition-duration', '0ms');
            if (state.windowEl.classList.contains('simplyit-chatbot-opacity-100')) {
                Object.assign(state.windowEl.style, {
                    left: '0',
                    right: '0',
                    top: '0',
                    bottom: '0',
                    width: '100vw',
                    height: '100dvh',
                    marginLeft: '0',
                    marginRight: '0',
                    borderRadius: '0',
                });
                handleKeyboard(state);
            }
        } else {
            state.windowEl.style.removeProperty('transition-duration');
            clearMobileViewportOverrides(state);
            state.windowEl.style.left = '';
            state.windowEl.style.right = '';
            state.windowEl.style.top = '';
            state.windowEl.style.width = '';
            state.windowEl.style.height = '';
            state.windowEl.style.borderRadius = '';
            state.windowEl.style[side] = `${hOffset}px`;
            state.windowEl.style.bottom = `${winVOffset}px`;
        }

        state.fab.style[side] = `${hOffset}px`;
        state.fab.style.bottom = `${fabVOffset}px`;

        if (isMobile) {
            if (state.windowEl.classList.contains('simplyit-chatbot-opacity-100')) {
                state.windowEl.classList.add('chat-expanded');
                state.fab.classList.add('fab-mobile-hidden');
            } else {
                state.windowEl.classList.remove('chat-expanded');
                state.fab.classList.remove('fab-mobile-hidden');
            }
        } else {
            state.fab.classList.remove('fab-mobile-hidden');
        }
    }

    function focusComposer(state) {
        state.input.focus({ preventScroll: true });
    }

    function saveChatHistory(state) {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state.chatHistory));
        localStorage.setItem(CHAT_ID_STORAGE_KEY, state.chatId);
    }

    function createMarkdownConverter() {
        return new showdown.Converter({
            tables: true,
            openLinksInNewWindow: true,
            linkTarget: '_blank',
        });
    }

    function formatMarkdown(converter, text) {
        return converter.makeHtml(text);
    }

    function avatarMarkup(imageBase, isUser) {
        const imageName = isUser ? 'user.jpg' : 'bot.jpg';
        return `<img src="${imageBase}/${imageName}" class="simplyit-chatbot-mt-1 simplyit-chatbot-h-7 simplyit-chatbot-w-7 simplyit-chatbot-flex-shrink-0 simplyit-chatbot-rounded-full simplyit-chatbot-ring-2 simplyit-chatbot-ring-white simplyit-chatbot-object-cover simplyit-chatbot-bg-white">`;
    }

    function messageMarkup(state, text, role, html) {
        const isUser = role === 'user';
        const bubbleStyle = isUser ? `background-color: ${USER_BUBBLE_COLOR}; color: ${USER_TEXT_COLOR}` : '';
        const bubbleClasses = isUser
            ? 'simplyit-chatbot-rounded-br-sm'
            : 'simplyit-chatbot-bg-white simplyit-chatbot-text-slate-800 simplyit-chatbot-ring-1 simplyit-chatbot-ring-slate-200 simplyit-chatbot-rounded-tl-sm';
        const containerClasses = isUser ? 'simplyit-chatbot-justify-end' : '';
        const avatar = avatarMarkup(state.imageBase, isUser);
        const body = html ?? escapeHtml(text).replace(/\n/g, '<br>');

        return `
            <div class="simplyit-chatbot-mb-3 simplyit-chatbot-flex simplyit-chatbot-flex-col ${containerClasses}">
                <div class="simplyit-chatbot-flex simplyit-chatbot-gap-2 ${isUser ? 'simplyit-chatbot-justify-end' : ''}">
                    ${isUser ? '' : avatar}
                    <div class="simplyit-chatbot-max-w-[85%] simplyit-chatbot-rounded-2xl simplyit-chatbot-px-3 simplyit-chatbot-py-2 simplyit-chatbot-text-sm simplyit-chatbot-shadow ${bubbleClasses} ${isUser ? '' : 'formatted-content'}" style="${bubbleStyle}">${body}</div>
                    ${isUser ? avatar : ''}
                </div>
            </div>
        `;
    }

    function appendMessageToDom(state, converter, message, scroll = true) {
        const html = message.role === 'assistant' ? formatMarkdown(converter, message.text) : null;
        state.messages.insertAdjacentHTML('beforeend', messageMarkup(state, message.text, message.role, html));
        if (scroll) {
            state.messages.scrollTop = state.messages.scrollHeight;
        }
    }

    function appendMessageWithTyping(state, converter, message, scroll = true) {
        if (message.role !== 'assistant') {
            appendMessageToDom(state, converter, message, scroll);
            return;
        }

        state.messages.insertAdjacentHTML(
            'beforeend',
            `
                <div class="simplyit-chatbot-mb-3 simplyit-chatbot-flex simplyit-chatbot-gap-2">
                    ${avatarMarkup(state.imageBase, false)}
                    <div class="simplyit-chatbot-max-w-[85%] simplyit-chatbot-rounded-2xl simplyit-chatbot-px-3 simplyit-chatbot-py-2 simplyit-chatbot-text-sm simplyit-chatbot-shadow simplyit-chatbot-bg-white simplyit-chatbot-text-slate-800 simplyit-chatbot-ring-1 simplyit-chatbot-ring-slate-200 simplyit-chatbot-rounded-tl-sm formatted-content"><span class="typing-text"></span></div>
                </div>
            `
        );

        const typingNodes = state.messages.querySelectorAll('.typing-text');
        const typingEl = typingNodes[typingNodes.length - 1];
        let userScrolledUp = false;
        const onScroll = () => {
            const maxScroll = state.messages.scrollHeight - state.messages.clientHeight;
            userScrolledUp = state.messages.scrollTop < maxScroll - 10;
        };
        state.messages.addEventListener('scroll', onScroll, { passive: true });

        const typeNextChar = (index) => {
            if (!typingEl) {
                return;
            }
            if (index >= message.text.length) {
                state.messages.removeEventListener('scroll', onScroll);
                return;
            }
            typingEl.innerHTML = formatMarkdown(converter, message.text.slice(0, index + 1));
            if (!userScrolledUp) {
                state.messages.scrollTop = state.messages.scrollHeight;
            }
            window.setTimeout(() => typeNextChar(index + 1), TYPING_SPEED);
        };

        typeNextChar(0);
    }

    function appendMessage(state, converter, options) {
        const message = { text: options.text, role: options.role, timestamp: Date.now() };
        state.chatHistory.push(message);
        saveChatHistory(state);
        if (options.typing && TYPING_ANIMATION_ENABLED && options.role === 'assistant') {
            appendMessageWithTyping(state, converter, message, options.scroll);
        } else {
            appendMessageToDom(state, converter, message, options.scroll);
        }
    }

    function showThinkingIndicator(state) {
        const dotStyle = `style="background-color: rgb(${state.typingDotRgb})"`;
        state.messages.insertAdjacentHTML(
            'beforeend',
            `
                <div class="simplyit-chatbot-mb-3 simplyit-chatbot-flex simplyit-chatbot-gap-2" id="thinking-indicator">
                    <img src="${state.imageBase}/bot.jpg" class="simplyit-chatbot-mt-1 simplyit-chatbot-h-7 simplyit-chatbot-w-7 simplyit-chatbot-flex-shrink-0 simplyit-chatbot-rounded-full simplyit-chatbot-ring-2 simplyit-chatbot-ring-white simplyit-chatbot-object-cover simplyit-chatbot-bg-white">
                    <div class="simplyit-chatbot-max-w-[75%] simplyit-chatbot-rounded-2xl simplyit-chatbot-rounded-tl-sm simplyit-chatbot-bg-white simplyit-chatbot-px-3 simplyit-chatbot-py-2 simplyit-chatbot-text-sm simplyit-chatbot-text-slate-800 simplyit-chatbot-ring-1 simplyit-chatbot-ring-slate-200 simplyit-chatbot-shadow">
                        <span class="thinking"><span class="thinking-dot" ${dotStyle}></span><span class="thinking-dot" ${dotStyle}></span><span class="thinking-dot" ${dotStyle}></span></span>
                    </div>
                </div>
            `
        );
        state.messages.scrollTop = state.messages.scrollHeight;
    }

    function hideThinkingIndicator(state) {
        state.shadowRoot.getElementById('thinking-indicator')?.remove();
    }

    function showErrorSnackbar(state, message) {
        state.errorMessage.textContent = message;
        state.snackbar.classList.remove('simplyit-chatbot-hidden');
        state.snackbar.classList.add('show');
        window.setTimeout(() => {
            hideErrorSnackbar(state);
        }, 30000);
    }

    function hideErrorSnackbar(state) {
        state.snackbar.classList.remove('show');
        window.setTimeout(() => {
            state.snackbar.classList.add('simplyit-chatbot-hidden');
        }, 300);
    }

    function scrollToLastUserMessage(state) {
        const userRows = state.messages.querySelectorAll('.simplyit-chatbot-justify-end');
        const lastUserRow = userRows[userRows.length - 1];
        if (lastUserRow) {
            lastUserRow.scrollIntoView({ block: 'start', behavior: 'instant' });
        }
    }

    function markLatestMessageFailed(state, text, sendMessage) {
        const allMessages = Array.from(state.messages.children).filter((element) =>
            element.classList.contains('simplyit-chatbot-mb-3')
        );
        const lastMessage = allMessages[allMessages.length - 1];
        if (!lastMessage) {
            return;
        }

        lastMessage.querySelector('.message-failed')?.remove();
        lastMessage.insertAdjacentHTML(
            'beforeend',
            '<div class="message-failed simplyit-chatbot-mt-1 simplyit-chatbot-text-xs simplyit-chatbot-text-red-500 simplyit-chatbot-cursor-pointer hover:simplyit-chatbot-underline" style="text-align: right;">Message failed to send. <span class="simplyit-chatbot-text-red-600 simplyit-chatbot-font-medium">Click to resend</span></div>'
        );
        const failed = lastMessage.querySelector('.message-failed');
        if (failed) {
            failed.addEventListener('click', (event) => {
                event.stopPropagation();
                failed.remove();
                sendMessage(text);
            }, { once: true });
            scrollToLastUserMessage(state);
        }
    }

    function renderChatHistory(state, converter) {
        state.messages.innerHTML = '';
        state.chatHistory.forEach((message) => appendMessageToDom(state, converter, message, false));
        window.setTimeout(() => {
            state.messages.scrollTop = state.messages.scrollHeight;
        }, 0);
    }

    function loadChatHistory(state, converter) {
        const saved = localStorage.getItem(CHAT_STORAGE_KEY);
        if (!saved) {
            appendMessage(state, converter, { text: WELCOME_MESSAGE, role: 'assistant', scroll: true, typing: false });
            return;
        }

        try {
            state.chatHistory = JSON.parse(saved);
            renderChatHistory(state, converter);
            if (state.chatHistory.length === 0) {
                appendMessage(state, converter, { text: WELCOME_MESSAGE, role: 'assistant', scroll: true, typing: false });
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
            state.chatHistory = [];
            appendMessage(state, converter, { text: WELCOME_MESSAGE, role: 'assistant', scroll: true, typing: false });
        }
    }

    function clearChatHistory(state, converter) {
        state.chatId = generateChatId();
        state.chatHistory = [];
        localStorage.removeItem(CHAT_STORAGE_KEY);
        localStorage.setItem(CHAT_ID_STORAGE_KEY, state.chatId);
        state.messages.innerHTML = '';
        appendMessage(state, converter, { text: WELCOME_MESSAGE, role: 'assistant', scroll: true, typing: false });
    }

    function toggleWindow(state, show) {
        const isMobile = window.innerWidth < 640;
        const openClasses = isMobile
            ? ['simplyit-chatbot-opacity-100', 'simplyit-chatbot-pointer-events-auto']
            : ['simplyit-chatbot-opacity-100', 'simplyit-chatbot-scale-100', 'simplyit-chatbot-pointer-events-auto'];
        const closedClasses = isMobile
            ? ['simplyit-chatbot-opacity-0', 'simplyit-chatbot-pointer-events-none']
            : ['simplyit-chatbot-opacity-0', 'simplyit-chatbot-scale-95', 'simplyit-chatbot-pointer-events-none'];
        const isOpen = !state.windowEl.classList.contains('simplyit-chatbot-opacity-0');
        const shouldShow = typeof show === 'boolean' ? show : !isOpen;

        state.windowEl.classList.remove('simplyit-chatbot-scale-95', 'simplyit-chatbot-scale-100', ...openClasses, ...closedClasses);
        state.windowEl.classList.add(...(shouldShow ? openClasses : closedClasses));

        if (shouldShow) {
            if (isMobile) {
                state.windowEl.classList.add('chat-fullscreen');
                document.body.style.overflow = 'hidden';
                window.setTimeout(() => handleKeyboard(state), 0);
            }
            focusComposer(state);
        } else {
            state.windowEl.classList.remove('chat-fullscreen');
            clearMobileViewportOverrides(state);
            document.body.style.overflow = '';
        }

        updatePositioning(state);
    }

    function toggleResize(state) {
        state.windowEl.classList.toggle('chat-expanded');
        const resizeButton = state.shadowRoot.getElementById('chat-resize');
        resizeButton.setAttribute('data-tooltip', state.windowEl.classList.contains('chat-expanded') ? 'Make chat smaller' : 'Make chat bigger');
        window.setTimeout(() => {
            state.messages.scrollTop = state.messages.scrollHeight;
        }, 100);
    }

    async function postChatMessage(text, chatId) {
        const wpConfig = window.SimplyITChatbot || null;
        if (wpConfig?.ajaxUrl) {
            const body = new URLSearchParams({
                action: 'simplyit_chatbot_message',
                nonce: wpConfig.nonce || '',
                message: text,
                chat_id: chatId,
            });
            const response = await fetch(wpConfig.ajaxUrl, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                body: body.toString(),
            });
            return response.json();
        }

        const response = await fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: text, chat_id: chatId }),
        });
        return response.json();
    }

    function bindEvents(state, converter) {
        const sendMessage = async (text) => {
            state.isWaitingForResponse = true;
            state.sendBtn.disabled = true;
            state.input.value = text;
            appendMessage(state, converter, { text, role: 'user', scroll: true, typing: false });
            state.input.value = '';

            const typingTimeout = window.setTimeout(() => {
                showThinkingIndicator(state);
            }, 1000);

            try {
                const response = await postChatMessage(text, state.chatId);
                window.clearTimeout(typingTimeout);
                hideThinkingIndicator(state);
                hideErrorSnackbar(state);
                const reply = response?.response ?? response?.data?.response ?? null;
                if (!reply) {
                    showErrorSnackbar(state, 'An error occurred, please try again.');
                    return;
                }
                appendMessage(state, converter, { text: reply, role: 'assistant', scroll: false, typing: true });
            } catch (error) {
                window.clearTimeout(typingTimeout);
                hideThinkingIndicator(state);
                console.error('Chat API error:', error);
                showErrorSnackbar(state, 'An error occurred, please try again.');
                markLatestMessageFailed(state, text, sendMessage);
            } finally {
                state.isWaitingForResponse = false;
                state.sendBtn.disabled = false;
            }
        };

        state.errorDismiss.addEventListener('click', () => hideErrorSnackbar(state));
        state.fab.addEventListener('click', () => {
            state.fab.classList.remove('chat-fab-pulse');
            toggleWindow(state);
        });
        state.shadowRoot.getElementById('chat-close').addEventListener('click', () => toggleWindow(state, false));
        state.shadowRoot.getElementById('chat-resize').addEventListener('click', () => toggleResize(state));
        state.shadowRoot.getElementById('chat-clear').addEventListener('click', () => {
            if (window.confirm('Are you sure you want to clear the chat history? The AI will forget your conversation.')) {
                clearChatHistory(state, converter);
            }
        });
        state.form.addEventListener('submit', (event) => {
            event.preventDefault();
            const text = state.input.value.trim();
            if (!text || state.isWaitingForResponse) {
                return;
            }
            sendMessage(text);
        });
        state.input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey && !state.isWaitingForResponse) {
                event.preventDefault();
                if (typeof state.form.requestSubmit === 'function') {
                    state.form.requestSubmit();
                } else {
                    state.form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }
            }
        });

        window.addEventListener('resize', () => updatePositioning(state));
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => handleKeyboard(state));
            window.visualViewport.addEventListener('scroll', () => handleKeyboard(state));
        }
    }

    async function init() {
        const host = getHost();
        if (!host) {
            return;
        }

        const assets = detectAssets(host);
        const [tailwindCss, chatbotCss] = await Promise.all([
            loadStylesheetText(assets.tailwindUrl),
            loadStylesheetText(assets.chatbotUrl),
        ]);
        const shadowRoot = createShadowRoot(host, `${tailwindCss}\n${chatbotCss}`);
        const state = createWidgetState(shadowRoot, assets.imageBase);
        const converter = createMarkdownConverter();

        applyLabels(state);
        applyChatColor(state, CHAT_COLOR);
        setInitialVisibility(state);
        updatePositioning(state);
        bindEvents(state, converter);
        loadChatHistory(state, converter);
    }

    const start = () => {
        init().catch((error) => {
            console.error('Failed to initialize chatbot:', error);
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
})();
