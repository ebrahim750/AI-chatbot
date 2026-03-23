<?php
/**
 * Plugin Name: SimplyIT Chatbot
 * Description: Floating AI chatbot widget for SimplyIT.
 * Version: 0.1.3
 * Author: SimplyIT
 */

if (!defined('ABSPATH')) {
    exit;
}

define('SIMPLYIT_CHATBOT_VERSION', '0.1.3');
define('SIMPLYIT_CHATBOT_PLUGIN_URL', plugin_dir_url(__FILE__));
define('SIMPLYIT_CHATBOT_PLUGIN_PATH', plugin_dir_path(__FILE__));

function simplyit_chatbot_log_path() {
    $log_dir = SIMPLYIT_CHATBOT_PLUGIN_PATH . 'logs/';

    if (!is_dir($log_dir)) {
        wp_mkdir_p($log_dir);
    }

    if (!is_dir($log_dir) || !is_writable($log_dir)) {
        return false;
    }

    $index_file = $log_dir . 'index.php';
    if (!file_exists($index_file)) {
        file_put_contents($index_file, "<?php\n");
    }

    $htaccess_file = $log_dir . '.htaccess';
    if (!file_exists($htaccess_file)) {
        file_put_contents($htaccess_file, "Deny from all\n");
    }

    return $log_dir . 'chatbot-' . gmdate('Y-m-d') . '.log';
}

function simplyit_chatbot_log($event, array $context = []) {
    $log_path = simplyit_chatbot_log_path();
    if (!$log_path) {
        return;
    }

    $entry = [
        'timestamp' => gmdate('c'),
        'event' => $event,
        'context' => $context,
    ];

    file_put_contents(
        $log_path,
        wp_json_encode($entry, JSON_UNESCAPED_SLASHES) . PHP_EOL,
        FILE_APPEND | LOCK_EX
    );
}

function simplyit_chatbot_enqueue_assets() {
    if (is_admin()) {
        return;
    }

    wp_enqueue_style(
        'simplyit-chatbot-inter',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        [],
        SIMPLYIT_CHATBOT_VERSION
    );

    wp_enqueue_style(
        'simplyit-chatbot-tailwind',
        SIMPLYIT_CHATBOT_PLUGIN_URL . 'assets/css/tailwind.css',
        [],
        SIMPLYIT_CHATBOT_VERSION
    );

    wp_enqueue_style(
        'simplyit-chatbot',
        SIMPLYIT_CHATBOT_PLUGIN_URL . 'assets/css/chatbot.css',
        ['simplyit-chatbot-tailwind'],
        SIMPLYIT_CHATBOT_VERSION
    );

    wp_enqueue_script('jquery');

    wp_enqueue_script(
        'simplyit-chatbot-showdown',
        SIMPLYIT_CHATBOT_PLUGIN_URL . 'assets/vendor/showdown.min.js',
        [],
        '2.1.0',
        true
    );

    wp_enqueue_script(
        'simplyit-chatbot-main',
        SIMPLYIT_CHATBOT_PLUGIN_URL . 'assets/js/main.js',
        ['jquery', 'simplyit-chatbot-showdown'],
        SIMPLYIT_CHATBOT_VERSION,
        true
    );

    $config = [
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('simplyit_chatbot_nonce'),
    ];

    wp_add_inline_script(
        'simplyit-chatbot-main',
        'window.SimplyITChatbot = ' . wp_json_encode($config) . ';',
        'before'
    );
}
add_action('wp_enqueue_scripts', 'simplyit_chatbot_enqueue_assets');

function simplyit_chatbot_render() {
    if (is_admin()) {
        return;
    }

    $assets_url = esc_url(SIMPLYIT_CHATBOT_PLUGIN_URL . 'assets');

    echo <<<HTML
<div id="simplyit-chatbot" data-assets-url="{$assets_url}">
    <!-- Floating Chat Button (hidden initially via inline style to prevent flash) -->
    <button id="chat-fab" type="button" style="visibility: hidden;" class="simplyit-chatbot-fixed simplyit-chatbot-bottom-6 simplyit-chatbot-right-6 simplyit-chatbot-z-40 simplyit-chatbot-inline-flex simplyit-chatbot-items-center simplyit-chatbot-gap-2 simplyit-chatbot-rounded-full simplyit-chatbot-bg-indigo-600 simplyit-chatbot-px-4 simplyit-chatbot-py-3 simplyit-chatbot-text-white simplyit-chatbot-shadow-lg simplyit-chatbot-shadow-indigo-600/30 hover:simplyit-chatbot-bg-indigo-500 focus:simplyit-chatbot-outline-none focus:simplyit-chatbot-ring-4 focus:simplyit-chatbot-ring-indigo-300">
        <!-- Chat icon (bigger) -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="simplyit-chatbot-size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
        <div class="simplyit-chatbot-flex simplyit-chatbot-flex-col simplyit-chatbot-items-start">
            <span id="chat-fab-label" class="simplyit-chatbot-font-medium simplyit-chatbot-text-sm simplyit-chatbot-leading-tight"></span>
            <span id="chat-fab-subtitle" class="simplyit-chatbot-text-xs simplyit-chatbot-opacity-80 simplyit-chatbot-leading-tight"></span>
        </div>
        <span class="simplyit-chatbot-sr-only">Open chat</span>
    </button>

    <!-- Chat Window (hidden initially via inline style to prevent flash) -->
    <div id="chat-window" class="simplyit-chatbot-fixed simplyit-chatbot-bottom-24 simplyit-chatbot-right-6 simplyit-chatbot-z-40 simplyit-chatbot-w-[92vw] simplyit-chatbot-max-w-lg simplyit-chatbot-rounded-2xl simplyit-chatbot-border simplyit-chatbot-border-slate-200 simplyit-chatbot-bg-white simplyit-chatbot-shadow-xl simplyit-chatbot-transition-all simplyit-chatbot-duration-300 simplyit-chatbot-opacity-0 simplyit-chatbot-scale-95 simplyit-chatbot-pointer-events-none" style="visibility: hidden;">
        <!-- Skeleton Loading State -->
        <div id="chat-skeleton" class="simplyit-chatbot-flex simplyit-chatbot-flex-col simplyit-chatbot-h-full">
            <!-- Skeleton Header -->
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
            <!-- Skeleton Messages -->
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
            <!-- Skeleton Composer -->
            <div class="simplyit-chatbot-flex simplyit-chatbot-items-end simplyit-chatbot-gap-2 simplyit-chatbot-border-t simplyit-chatbot-border-slate-200 simplyit-chatbot-bg-white simplyit-chatbot-px-3 simplyit-chatbot-py-3">
                <div class="simplyit-chatbot-flex-1 simplyit-chatbot-h-10 simplyit-chatbot-rounded-xl simplyit-chatbot-border simplyit-chatbot-border-slate-200 simplyit-chatbot-bg-slate-50 simplyit-chatbot-animate-pulse"></div>
                <div class="simplyit-chatbot-h-10 simplyit-chatbot-w-16 simplyit-chatbot-rounded-xl simplyit-chatbot-bg-indigo-600 simplyit-chatbot-animate-pulse"></div>
            </div>
        </div>
        <!-- Actual Chat Content (hidden until loaded) -->
        <div id="chat-content" class="simplyit-chatbot-hidden simplyit-chatbot-flex simplyit-chatbot-flex-col simplyit-chatbot-h-full">
        <!-- Header -->
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
            <!-- Error Snackbar (hidden by default) -->
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

        <!-- Messages -->
        <div id="chat-messages" class="simplyit-chatbot-nice-scrollbar simplyit-chatbot-h-[28rem] simplyit-chatbot-overflow-y-auto simplyit-chatbot-bg-slate-50 simplyit-chatbot-px-3 simplyit-chatbot-py-3"></div>

        <!-- Composer -->
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
HTML;
}
add_action('wp_footer', 'simplyit_chatbot_render');

function simplyit_chatbot_handle_message() {
    $nonce_ok = check_ajax_referer('simplyit_chatbot_nonce', 'nonce', false);
    if (!$nonce_ok) {
        simplyit_chatbot_log('invalid_nonce', [
            'remote_addr' => isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '',
        ]);
        wp_send_json_error(['error' => 'Invalid nonce'], 403);
    }

    $message = isset($_POST['message']) ? trim(wp_unslash($_POST['message'])) : '';
    $chat_id = isset($_POST['chat_id']) ? trim(wp_unslash($_POST['chat_id'])) : '';

    if ($message === '' || $chat_id === '') {
        wp_send_json_error(['error' => 'Message and chat_id are required'], 400);
    }

    $webhookTestUrl = 'https://ai-backend.simplyask.live/webhook-test/facd547d-5e9b-4f70-9970-ac17be2823b1';
    $webhookProdUrl = 'https://ai-backend.simplyask.live/webhook/facd547d-5e9b-4f70-9970-ac17be2823b1';
    $prod = true;
    $webhookUrl = $prod ? $webhookProdUrl : $webhookTestUrl;

    $payload = [
        'message' => $message,
        'chat_id' => $chat_id,
        'origin' => home_url(),
    ];

    simplyit_chatbot_log('request_started', [
        'webhook_url' => $webhookUrl,
        'origin' => $payload['origin'],
        'chat_id' => $chat_id,
        'message_length' => strlen($message),
        'message_preview' => function_exists('mb_substr') ? mb_substr($message, 0, 200) : substr($message, 0, 200),
    ]);

    $response = wp_remote_post($webhookUrl, [
        'headers' => [
            'Content-Type' => 'application/json',
        ],
        'body' => wp_json_encode($payload),
        'timeout' => 10,
    ]);

    if (is_wp_error($response)) {
        simplyit_chatbot_log('request_failed', [
            'webhook_url' => $webhookUrl,
            'origin' => $payload['origin'],
            'chat_id' => $chat_id,
            'error_code' => $response->get_error_code(),
            'error_message' => $response->get_error_message(),
            'error_data' => $response->get_error_data(),
        ]);
        wp_send_json_error(['error' => 'Failed to connect to service'], 500);
    }

    $http_code = (int) wp_remote_retrieve_response_code($response);
    $body = wp_remote_retrieve_body($response);

    if ($http_code < 200 || $http_code >= 300) {
        $status = $http_code ?: 500;
        simplyit_chatbot_log('request_bad_status', [
            'webhook_url' => $webhookUrl,
            'origin' => $payload['origin'],
            'chat_id' => $chat_id,
            'http_code' => $http_code,
            'response_body' => function_exists('mb_substr') ? mb_substr($body, 0, 2000) : substr($body, 0, 2000),
        ]);
        wp_send_json_error(['error' => 'Service temporarily unavailable'], $status);
    }

    $response_data = json_decode($body, true);

    if (!isset($response_data['response'])) {
        if (is_array($response_data) && isset($response_data[0]['output'])) {
            wp_send_json(['response' => $response_data[0]['output']]);
        }
        simplyit_chatbot_log('request_invalid_response', [
            'webhook_url' => $webhookUrl,
            'origin' => $payload['origin'],
            'chat_id' => $chat_id,
            'http_code' => $http_code,
            'response_body' => function_exists('mb_substr') ? mb_substr($body, 0, 2000) : substr($body, 0, 2000),
        ]);
        wp_send_json_error(['error' => 'Invalid response from service'], 500);
    }

    wp_send_json(['response' => $response_data['response']]);
}
add_action('wp_ajax_simplyit_chatbot_message', 'simplyit_chatbot_handle_message');
add_action('wp_ajax_nopriv_simplyit_chatbot_message', 'simplyit_chatbot_handle_message');
