$(function () {
    // Chat widget position configuration: 'left' or 'right'
    const CHAT_POSITION = 'right';
    
    // Chat widget primary color (hex)
    const CHAT_COLOR = '#000000';
    
    // User chat bubble color (hex)
    const USER_BUBBLE_COLOR = '#000000';
    
    // User chat text color (hex)
    const USER_TEXT_COLOR = '#ffffff';
    
    const $window = $('#chat-window');
    const $fab = $('#chat-fab');
    const $form = $('#chat-form');
    const $input = $('#chat-input');
    const $messages = $('#chat-messages');
    
    // Helper function to convert hex to RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    // Apply custom color to elements
    function applyChatColor(color) {
        const rgb = hexToRgb(color);
        if (!rgb) return;
        
        const rgbString = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
        
        // FAB button
        $fab.css('background-color', color);
        $fab.css('box-shadow', `0 10px 15px -3px rgba(${rgbString}, 0.3)`);
        $fab.hover(function() {
            $(this).css('background-color', `rgba(${rgbString}, 0.9)`);
        }, function() {
            $(this).css('background-color', color);
        });
        
        // Header
        $window.find('> div:first-child').css('background-color', color);
        
        // Send button
        $('#chat-send').css('background-color', color);
        $('#chat-send').hover(function() {
            $(this).css('background-color', `rgba(${rgbString}, 0.9)`);
        }, function() {
            $(this).css('background-color', color);
        });
        
        // Input focus
        $input.on('focus', function() {
            $(this).css('border-color', color);
            $(this).css('box-shadow', `0 0 0 3px rgba(${rgbString}, 0.2)`);
        });
        $input.on('blur', function() {
            $(this).css('border-color', '#e2e8f0');
            $(this).css('box-shadow', '0 1px 2px 0 rgb(0 0 0 / 0.05)');
        });
        
        // Avatar for assistant messages
        $(document).on('DOMNodeInserted', function(e) {
            const $el = $(e.target);
            $el.find('.bg-indigo-600').css('background-color', color);
        });
    }
    
    // Apply colors
    applyChatColor(CHAT_COLOR);
    
    // Apply position classes based on configuration
    if (CHAT_POSITION === 'left') {
        $fab.removeClass('right-6').addClass('left-6');
        $window.removeClass('right-6').addClass('left-6');
    }

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

    // Chat history management with localStorage
    const CHAT_STORAGE_KEY = 'chatbot_history';
    let chatHistory = [];

    function saveChatHistory() {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));
    }

    function loadChatHistory() {
        const saved = localStorage.getItem(CHAT_STORAGE_KEY);
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
            appendMessageToDOM(message, false);
        });
        setTimeout(() => {
            $messages.scrollTop($messages.prop('scrollHeight'));
        }, 0);
    }

    function clearChatHistory() {
        chatHistory = [];
        localStorage.removeItem(CHAT_STORAGE_KEY);
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

    function appendMessage({ text, role, scroll = true }) {
        // Add to chat history
        const message = { text, role, timestamp: Date.now() };
        chatHistory.push(message);
        saveChatHistory();
        
        // Render to DOM
        appendMessageToDOM(message, scroll);
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

        // Tables
        formatted = formatted.replace(/(\|.*\|[\r\n]+)(\|[\s\-:|]+\|[\r\n]+)((?:\|.*\|[\r\n]+)+)/g, (match, header, separator, body) => {
            const headerCells = header.trim().split('|').filter(c => c.trim() !== '');
            const alignments = separator.trim().split('|').filter(c => c.trim() !== '');
            const bodyRows = body.trim().split('\n');
            let html = '<table class="border-collapse border border-slate-200 mb-3"><thead><tr>';
            headerCells.forEach((cell, i) => {
                const align = alignments[i]?.includes(':---:') ? 'text-center' : alignments[i]?.includes('---:') ? 'text-right' : 'text-left';
                html += `<th class="${align} px-3 py-2 border border-slate-200 font-semibold">${cell.trim()}</th>`;
            });
            html += '</tr></thead><tbody>';
            bodyRows.forEach(row => {
                if (row.trim()) {
                    const cells = row.trim().split('|').filter(c => c.trim() !== '');
                    html += '<tr>';
                    cells.forEach((cell, i) => {
                        const align = alignments[i]?.includes(':---:') ? 'text-center' : alignments[i]?.includes('---:') ? 'text-right' : 'text-left';
                        html += `<td class="${align} px-3 py-2 border border-slate-200">${cell.trim()}</td>`;
                    });
                    html += '</tr>';
                }
            });
            return html + '</tbody></table>';
        });

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

    function appendMessageToDOM(message, scroll = true) {
        const { text, role } = message;
        const isUser = role === 'user';
        const avatar = isUser
            ? '<img src="img/user.png" class="mt-1 h-7 w-7 flex-shrink-0 rounded-full ring-2 ring-white object-cover">'
            : '<img src="img/bot.png" class="mt-1 h-7 w-7 flex-shrink-0 rounded-full ring-2 ring-white object-cover">';

        const bubbleStyle = isUser ? `background-color: ${USER_BUBBLE_COLOR}; color: ${USER_TEXT_COLOR}` : '';
        const bubbleClasses = isUser
            ? 'rounded-br-sm'
            : 'bg-white text-slate-800 ring-1 ring-slate-200 rounded-tl-sm';

        const containerClasses = isUser ? 'justify-end' : '';
        
        // Format text based on role
        const displayText = isUser ? $('<div>').text(text).html().replace(/\n/g, '<br>') : formatMarkdown(text);
        
        const content = `
            <div class="mb-3 flex gap-2 ${containerClasses}">
                ${isUser ? '' : avatar}
                <div class="max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow ${bubbleClasses} ${isUser ? '' : 'formatted-content'}" style="${bubbleStyle}">${displayText}</div>
                ${isUser ? avatar : ''}
            </div>
        `;
        $messages.append(content);
        if (scroll) {
            $messages.scrollTop($messages.prop('scrollHeight'));
        }
    }

    function showTypingIndicator() {
        const content = `
            <div class="mb-3 flex gap-2" id="typing-indicator">
                <img src="img/bot.png" class="mt-1 h-7 w-7 flex-shrink-0 rounded-full ring-2 ring-white object-cover">
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

    function scrollToLastUserMessage() {
        const $lastUserMsg = $messages.find('.justify-end').last();
        if ($lastUserMsg.length) {
            $lastUserMsg[0].scrollIntoView({ block: 'start', behavior: 'instant' });
        }
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
                appendMessage({ text: response.response, role: 'assistant', scroll: false });
                scrollToLastUserMessage();
            },
            error: function(xhr, status, error) {
                hideTypingIndicator();
                const errorMessage = xhr.responseJSON?.error || 'Failed to get response from assistant';
                appendMessage({ text: `Error: ${errorMessage}`, role: 'assistant', scroll: false });
                scrollToLastUserMessage();
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


