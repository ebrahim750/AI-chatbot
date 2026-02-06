$(function () {
    const $window = $('#chat-window');
    const $fab = $('#chat-fab');
    const $form = $('#chat-form');
    const $input = $('#chat-input');
    const $messages = $('#chat-messages');

    function generateChatId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const array = new Uint32Array(32);
        window.crypto.getRandomValues(array);
        for (let i = 0; i < 32; i++) {
            result += chars[array[i] % chars.length];
        }
        return result;
    }

    let chatId = localStorage.getItem('chatId') || generateChatId();
    localStorage.setItem('chatId', chatId);

    // Chat history management with cookies
    const CHAT_COOKIE_NAME = 'chatbot_history';
    let chatHistory = [];

    // Cookie utility functions
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    function deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }

    function saveChatHistory() {
        setCookie(CHAT_COOKIE_NAME, JSON.stringify(chatHistory), 1); // 24 hours
    }

    function loadChatHistory() {
        const saved = getCookie(CHAT_COOKIE_NAME);
        if (saved) {
            try {
                chatHistory = JSON.parse(saved);
                renderChatHistory();
            } catch (e) {
                console.error('Failed to load chat history:', e);
                chatHistory = [];
            }
        }
    }

    function renderChatHistory() {
        $messages.empty();
        chatHistory.forEach(message => {
            appendMessageToDOM(message);
        });
        $messages.scrollTop($messages.prop('scrollHeight'));
    }

    function clearChatHistory() {
        chatHistory = [];
        deleteCookie(CHAT_COOKIE_NAME);
        $messages.empty();
        // Add welcome message
        appendMessage({ text: 'Hi! How can I help you today?', role: 'assistant' });
    }

    function toggleWindow(show) {
        if (show === true) {
            $window.removeClass('opacity-0 scale-95 pointer-events-none');
            $window.addClass('opacity-100 scale-100 pointer-events-auto');
            setTimeout(() => $input.trigger('focus'), 300);
            return;
        }
        if (show === false) {
            $window.removeClass('opacity-100 scale-100 pointer-events-auto');
            $window.addClass('opacity-0 scale-95 pointer-events-none');
            return;
        }
        if ($window.hasClass('opacity-0')) {
            $window.removeClass('opacity-0 scale-95 pointer-events-none');
            $window.addClass('opacity-100 scale-100 pointer-events-auto');
            setTimeout(() => $input.trigger('focus'), 300);
        } else {
            $window.removeClass('opacity-100 scale-100 pointer-events-auto');
            $window.addClass('opacity-0 scale-95 pointer-events-none');
        }
    }

    function appendMessage({ text, role }) {
        // Add to chat history
        const message = { text, role, timestamp: Date.now() };
        chatHistory.push(message);
        saveChatHistory();
        
        // Render to DOM
        appendMessageToDOM(message);
    }

    // Markdown formatting function
    function formatMarkdown(text) {
        // Escape HTML first
        let formatted = $('<div>').text(text).html();
        
        // Bold text **text** or __text__
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/__(.*?)__/g, '<strong>$1</strong>');
        
        // Italic text *text* or _text_
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        formatted = formatted.replace(/_(.*?)_/g, '<em>$1</em>');
        
        // Headers ### Header
        formatted = formatted.replace(/^### (.*$)/gm, '<h3 class="font-semibold text-base mt-3 mb-2">$1</h3>');
        formatted = formatted.replace(/^## (.*$)/gm, '<h2 class="font-semibold text-lg mt-4 mb-2">$1</h2>');
        formatted = formatted.replace(/^# (.*$)/gm, '<h1 class="font-bold text-xl mt-4 mb-3">$1</h1>');
        
        // Numbered lists 1. item
        formatted = formatted.replace(/^(\d+)\.\s+(.*)$/gm, '<div class="flex mb-1"><span class="font-medium mr-2">$1.</span><span>$2</span></div>');
        
        // Bullet points * item or - item
        formatted = formatted.replace(/^[\*\-\+]\s+(.*)$/gm, '<div class="flex mb-1"><span class="mr-2">•</span><span>$1</span></div>');
        
        // Line breaks (double newline = paragraph break)
        formatted = formatted.replace(/\n\n/g, '</p><p class="mb-2">');
        formatted = '<p class="mb-2">' + formatted + '</p>';
        
        // Single line breaks
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Clean up empty paragraphs
        formatted = formatted.replace(/<p class="mb-2"><\/p>/g, '');
        formatted = formatted.replace(/<p class="mb-2"><br><\/p>/g, '');
        
        return formatted;
    }

    function appendMessageToDOM(message) {
        const { text, role } = message;
        const isUser = role === 'user';
        const avatar = isUser
            ? '<div class="mt-1 h-7 w-7 flex-shrink-0 rounded-full bg-slate-300 text-slate-700 ring-2 ring-white"><div class="flex h-full w-full items-center justify-center text-xs font-semibold">U</div></div>'
            : '<div class="mt-1 h-7 w-7 flex-shrink-0 rounded-full bg-indigo-600 text-white ring-2 ring-white"><div class="flex h-full w-full items-center justify-center text-xs font-semibold">A</div></div>';

        const bubbleClasses = isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-white text-slate-800 ring-1 ring-slate-200 rounded-tl-sm';

        const containerClasses = isUser ? 'justify-end' : '';
        
        // Format text based on role
        const displayText = isUser ? $('<div>').text(text).html() : formatMarkdown(text);
        
        const content = `
            <div class="mb-3 flex gap-2 ${containerClasses}">
                ${isUser ? '' : avatar}
                <div class="max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow ${bubbleClasses} ${isUser ? '' : 'formatted-content'}">${displayText}</div>
                ${isUser ? avatar : ''}
            </div>
        `;
        $messages.append(content);
        $messages.scrollTop($messages.prop('scrollHeight'));
    }

    function showTypingIndicator() {
        const content = `
            <div class="mb-3 flex gap-2" id="typing-indicator">
                <div class="mt-1 h-7 w-7 flex-shrink-0 rounded-full bg-indigo-600 text-white ring-2 ring-white"><div class="flex h-full w-full items-center justify-center text-xs font-semibold">A</div></div>
                <div class="max-w-[75%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200 shadow">
                    <span class="typing"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></span>
                </div>
            </div>
        `;
        $messages.append(content);
        $messages.scrollTop($messages.prop('scrollHeight'));
    }

    function hideTypingIndicator() {
        $('#typing-indicator').remove();
    }

    // Initialize chat history on page load
    loadChatHistory();
    if (chatHistory.length === 0) {
        appendMessage({ text: 'Hi! How can I help you today?', role: 'assistant' });
    }

    // Resize functionality
    function toggleResize() {
        $window.toggleClass('chat-expanded');
        const isExpanded = $window.hasClass('chat-expanded');
        
        // Update resize button icon
        const resizeIcon = $('#chat-resize svg');
        if (isExpanded) {
            // Show minimize icon when expanded
            resizeIcon.html('<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>');
            $('#chat-resize').attr('title', 'Make chat smaller');
        } else {
            // Show expand icon when normal
            resizeIcon.html('<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>');
            $('#chat-resize').attr('title', 'Make chat bigger');
        }
        
        // Scroll to bottom after resize
        setTimeout(() => {
            $messages.scrollTop($messages.prop('scrollHeight'));
        }, 100);
    }

    // Toggle handlers
    $fab.on('click', () => toggleWindow());
    $('#chat-close').on('click', () => toggleWindow(false));
    $('#chat-resize').on('click', () => toggleResize());
    $('#chat-clear').on('click', () => {
        if (confirm('Are you sure you want to clear the chat history?')) {
            clearChatHistory();
        }
    });

    // Submit handler
    $form.on('submit', function (e) {
        e.preventDefault();
        const text = $input.val().trim();
        if (!text) return;

        appendMessage({ text, role: 'user' });
        $input.val('');

        // Show typing while waiting for response
        showTypingIndicator();

        // Send to n8n webhook via PHP
        $.ajax({
            url: 'api.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ message: text, chat_id: chatId }),
            success: function(response) {
                hideTypingIndicator();
                appendMessage({ text: response.response, role: 'assistant' });
            },
            error: function(xhr, status, error) {
                hideTypingIndicator();
                const errorMessage = xhr.responseJSON?.error || 'Failed to get response from assistant';
                appendMessage({ text: `Error: ${errorMessage}`, role: 'assistant' });
            }
        });
    });

    // Enter to send, Shift+Enter for newline
    $input.on('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            $form.trigger('submit');
        }
    });
});


