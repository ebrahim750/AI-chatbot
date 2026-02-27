$(function () {
    // Chat widget position configuration: 'left' or 'right'
    const CHAT_POSITION = 'right';
    
    // Positioning configuration (pixels)
    // Horizontal offset from edge (left or right depending on CHAT_POSITION)
    const CHAT_HORIZONTAL_OFFSET_DESKTOP = 50;
    const CHAT_HORIZONTAL_OFFSET_MOBILE = 16;
    
    // Vertical offset from bottom (in pixels)
    const CHAT_FAB_VERTICAL_OFFSET_DESKTOP = 50;     // bottom-6 ≈ 24px
    const CHAT_FAB_VERTICAL_OFFSET_MOBILE = 20;
    
    // Gap between FAB bottom and window bottom (in pixels)
    const CHAT_WINDOW_FAB_GAP_DESKTOP = 72;  // 96 - 24
    const CHAT_WINDOW_FAB_GAP_MOBILE = 60;   // 80 - 20
    
    // Chat widget primary color (hex)
    const CHAT_COLOR = '#dd3a0a';
    
    // FAB button label text
    const FAB_LABEL = 'Need help?';
    
    // FAB button subtitle text
    const FAB_SUBTITLE = 'AI Assistant';
    
    // Enable/disable pulsing animation (true/false)
    const FAB_PULSE_ENABLED = true;
    
    // Chat header label text
    const HEADER_LABEL = 'S.A.M (Simply Ask Me)';
    
    // User chat bubble color (hex)
    const USER_BUBBLE_COLOR = '#3d2e2e';
    
    // User chat text color (hex)
    const USER_TEXT_COLOR = '#ffffff';
    
    // Welcome message
    const WELCOME_MESSAGE = 'Hi! I am SAM, how may I be of assistance?\n Have any questions about SimplyIT?\n Or would you like to book a free audit for your business?';
    
    const $window = $('#chat-window');
    const $fab = $('#chat-fab');
    const $form = $('#chat-form');
    const $input = $('#chat-input');
    const $messages = $('#chat-messages');
    const $snackbar = $('#error-snackbar');
    const $errorMessage = $('#error-message');
    const $errorDismiss = $('#error-dismiss');
    const $fabLabel = $('#chat-fab-label');
    const $fabSubtitle = $('#chat-fab-subtitle');
    const $headerLabel = $('#header-label');
    const $headerSubtitle = $('#header-subtitle');
    const $sendBtn = $('#chat-send');
    let isWaitingForResponse = false;
    
    // Set FAB label and subtitle text
    $fabLabel.text(FAB_LABEL);
    $fabSubtitle.text(FAB_SUBTITLE);
    
    // Set header label and subtitle
    $headerLabel.text(HEADER_LABEL);
    $headerSubtitle.text(FAB_SUBTITLE);
    
    // Initialize visibility - hide skeleton, show actual content, show FAB
    $('#chat-skeleton').hide();
    $('#chat-content').removeClass('hidden').show();
    $fab.css('visibility', 'visible');
    if (FAB_PULSE_ENABLED) {
        $fab.addClass('chat-fab-pulse');
    }
    $window.css('visibility', 'visible');
    
    // Store typing indicator color (default tailwind:indigo-500)
    let typingDotRgb = '99, 102, 241';
    
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
        // Store for typing indicator
        typingDotRgb = rgbString;
        
        // FAB button
        $fab.css('background-color', color);
        $fab.css('box-shadow', `0 10px 15px -3px rgba(${rgbString}, 0.3)`);
        $fab.hover(function() {
            $(this).css('background-color', `rgba(${rgbString}, 0.9)`);
        }, function() {
            $(this).css('background-color', color);
        });
        
        // Header
        $('#chat-content > div:first-child').css('background-color', color);
        
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
    
    // Apply pulse color using already-converted RGB (lighter/transparent)
    if (FAB_PULSE_ENABLED) {
        document.documentElement.style.setProperty('--chat-pulse-color', `rgba(${typingDotRgb}, 0.4)`);
    }
    
     // Positioning function for desktop/mobile responsive offsets
     function updatePositioning() {
         const isMobile = window.innerWidth < 640; // sm breakpoint
         const hOffset = isMobile ? CHAT_HORIZONTAL_OFFSET_MOBILE : CHAT_HORIZONTAL_OFFSET_DESKTOP;
         const fabVOffset = isMobile ? CHAT_FAB_VERTICAL_OFFSET_MOBILE : CHAT_FAB_VERTICAL_OFFSET_DESKTOP;
         const gap = isMobile ? CHAT_WINDOW_FAB_GAP_MOBILE : CHAT_WINDOW_FAB_GAP_DESKTOP;
          // Calculate window bottom offset
          let winVOffset = fabVOffset + gap;
          
          // On mobile, if window is open (FAB hidden), set window bottom to 0 (no gap)
          if (isMobile && $window.hasClass('opacity-100')) {
              winVOffset = 0;
          }
          
          const side = CHAT_POSITION; // 'left' or 'right'
          
          // Apply to chat window
          if (isMobile) {
              // On mobile, center horizontally with auto margins
              $window.css({
                  left: '0',
                   right: '0',
                   marginLeft: 'auto',
                   marginRight: 'auto',
                   bottom: winVOffset + 'px'
               });
          } else {
              // On desktop, position based on config
              $window.css({
                  [side]: hOffset + 'px',
                  bottom: winVOffset + 'px'
              });
          }
          
          // Apply to FAB
          $fab.css({
              [side]: hOffset + 'px',
              bottom: fabVOffset + 'px'
          });
          
           // Mobile: manage expanded class based on window state
           if (isMobile) {
               if ($window.hasClass('opacity-100')) {
                   // Open: ensure expanded
                   if (!$window.hasClass('chat-expanded')) {
                       $window.addClass('chat-expanded');
                   }
               } else {
                   // Closed: remove expanded to keep small size
                   if ($window.hasClass('chat-expanded')) {
                       $window.removeClass('chat-expanded');
                   }
               }
           }
           
           // Handle FAB visibility on mobile
           if (isMobile) {
               if ($window.hasClass('opacity-100')) {
                   $fab.addClass('fab-mobile-hidden');
               } else {
                   $fab.removeClass('fab-mobile-hidden');
               }
           } else {
               // On desktop, ensure FAB is visible
               $fab.removeClass('fab-mobile-hidden');
           }
       }
    
    // Initial positioning
    updatePositioning();
    
    // Update on window resize
    $(window).on('resize', updatePositioning);

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
        chatId = generateChatId();
        localStorage.setItem('chatId', chatId);
        chatHistory = [];
        localStorage.removeItem(CHAT_STORAGE_KEY);
        $messages.empty();
        // Add welcome message
        appendMessage({ text: WELCOME_MESSAGE, role: 'assistant' });
    }

     function toggleWindow(show) {
         if (show === true) {
             $window.removeClass('opacity-0 scale-95 pointer-events-none');
             $window.addClass('opacity-100 scale-100 pointer-events-auto');
             setTimeout(() => $input.trigger('focus'), 300);
         } else if (show === false) {
             $window.removeClass('opacity-100 scale-100 pointer-events-auto');
             $window.addClass('opacity-0 scale-95 pointer-events-none');
         } else {
             if ($window.hasClass('opacity-0')) {
                 $window.removeClass('opacity-0 scale-95 pointer-events-none');
                 $window.addClass('opacity-100 scale-100 pointer-events-auto');
                 setTimeout(() => $input.trigger('focus'), 300);
             } else {
                 $window.removeClass('opacity-100 scale-100 pointer-events-auto');
                 $window.addClass('opacity-0 scale-95 pointer-events-none');
             }
         }
         // Update FAB visibility and positioning after toggle
         updatePositioning();
     }

    function appendMessage({ text, role, scroll = true }) {
        // Add to chat history
        const message = { text, role, timestamp: Date.now() };
        chatHistory.push(message);
        saveChatHistory();
        
        // Render to DOM
        appendMessageToDOM(message, scroll);
    }

    // Initialize Showdown converter
    const markdownConverter = new showdown.Converter({
        tables: true,
        openLinksInNewWindow: true,
        linkTarget: '_blank'
    });

    function formatMarkdown(text) {
        return markdownConverter.makeHtml(text);
    }

    function appendMessageToDOM(message, scroll = true) {
        const { text, role } = message;
        const isUser = role === 'user';
        const avatar = isUser
            ? '<img src="img/user.jpg" class="mt-1 h-7 w-7 flex-shrink-0 rounded-full ring-2 ring-white object-cover bg-white">'
            : '<img src="img/bot.jpg" class="mt-1 h-7 w-7 flex-shrink-0 rounded-full ring-2 ring-white object-cover bg-white">';

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
        const dotStyle = `style="background-color: rgb(${typingDotRgb})"`;
        const content = `
            <div class="mb-3 flex gap-2" id="typing-indicator">
                <img src="img/bot.jpg" class="mt-1 h-7 w-7 flex-shrink-0 rounded-full ring-2 ring-white object-cover bg-white">
                <div class="max-w-[75%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200 shadow">
                    <span class="typing"><span class="typing-dot" ${dotStyle}></span><span class="typing-dot" ${dotStyle}></span><span class="typing-dot" ${dotStyle}></span></span>
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
        appendMessage({ text: WELCOME_MESSAGE, role: 'assistant' });
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
            $('#chat-resize').attr('data-tooltip', 'Make chat smaller');
        } else {
            // Show expand icon when normal
            resizeIcon.html('<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>');
            $('#chat-resize').attr('data-tooltip', 'Make chat bigger');
        }
        
        // Scroll to bottom after resize
        setTimeout(() => {
            $messages.scrollTop($messages.prop('scrollHeight'));
         }, 100);
     }

     // Snackbar error notification
     function showErrorSnackbar(message) {
         $errorMessage.text(message);
         $snackbar.removeClass('hidden').addClass('show');
         
         // Auto-hide after 30 seconds
         setTimeout(() => {
             hideErrorSnackbar();
         }, 30000);
     }

     function hideErrorSnackbar() {
         $snackbar.removeClass('show');
         setTimeout(() => {
             $snackbar.addClass('hidden');
         }, 300);
     }

     // Dismiss button handler
     $errorDismiss.on('click', hideErrorSnackbar);

    // Toggle handlers
    $fab.on('click', () => {
        $fab.removeClass('chat-fab-pulse');
        toggleWindow();
    });
    $('#chat-close').on('click', () => toggleWindow(false));
    $('#chat-resize').on('click', () => toggleResize());
    $('#chat-clear').on('click', () => {
        if (confirm('Are you sure you want to clear the chat history? This will cause the AI to forget your conversation.')) {
            clearChatHistory();
        }
    });

    // Submit handler
    $form.on('submit', function (e) {
        e.preventDefault();
        const text = $input.val().trim();
        if (!text || isWaitingForResponse) return;

        isWaitingForResponse = true;
        $sendBtn.prop('disabled', true);

        appendMessage({ text, role: 'user' });
        $input.val('');

        // Delay typing indicator by 1 second (but don't delay the API call)
        let typingTimeout = setTimeout(() => {
            showTypingIndicator();
        }, 1000);

        // Send to n8n webhook via PHP
        $.ajax({
            url: 'api.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ message: text, chat_id: chatId }),
            success: function(response) {
                clearTimeout(typingTimeout);
                hideTypingIndicator();
                appendMessage({ text: response.response, role: 'assistant', scroll: false });
                scrollToLastUserMessage();
                isWaitingForResponse = false;
                $sendBtn.prop('disabled', false);
            },
            error: function(xhr, status, error) {
                clearTimeout(typingTimeout);
                hideTypingIndicator();
                // Log technical details for debugging
                console.error('Chat API error:', { status, error, response: xhr.responseJSON });
                // Show generic user-friendly message
                showErrorSnackbar('An error occurred, please try again.');
                scrollToLastUserMessage();
                isWaitingForResponse = false;
                $sendBtn.prop('disabled', false);
            }
        });
    });

    // Enter to send, Shift+Enter for newline
    $input.on('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey && !isWaitingForResponse) {
            e.preventDefault();
            $form.trigger('submit');
        }
    });
});


