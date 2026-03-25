<?php
/**
 * Plugin Name: SimplyIT Chatbot
 * Description: Floating AI chatbot widget for SimplyIT.
 * Version: 0.2.3
 * Author: SimplyIT
 */

if (!defined('ABSPATH')) {
    exit;
}

define('SIMPLYIT_CHATBOT_VERSION', '0.2.3');
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
        ['simplyit-chatbot-showdown'],
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
add_action('wp_enqueue_scripts', 'simplyit_chatbot_enqueue_assets', 100);

function simplyit_chatbot_render() {
    if (is_admin()) {
        return;
    }

    $assets_url = esc_url(SIMPLYIT_CHATBOT_PLUGIN_URL . 'assets');

    echo <<<HTML
<div id="simplyit-chatbot-host" data-assets-url="{$assets_url}" style="position:relative;z-index:2147483647"></div>
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

    if (!function_exists('curl_init')) {
        simplyit_chatbot_log('curl_unavailable', [
            'webhook_url' => $webhookUrl,
            'origin' => $payload['origin'],
            'chat_id' => $chat_id,
        ]);
        wp_send_json_error(['error' => 'cURL is required to connect to the chat service'], 500);
    }

    $request_body = wp_json_encode($payload);
    $curl = curl_init($webhookUrl);

    if ($curl === false) {
        simplyit_chatbot_log('request_transport_init_failed', [
            'webhook_url' => $webhookUrl,
            'origin' => $payload['origin'],
            'chat_id' => $chat_id,
        ]);
        wp_send_json_error(['error' => 'Failed to initialize the chat service connection'], 500);
    }

    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $request_body,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
        ],
    ]);

    $body = curl_exec($curl);
    $http_code = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $curl_errno = curl_errno($curl);
    $curl_error = curl_error($curl);
    curl_close($curl);

    if ($body === false) {
        simplyit_chatbot_log('request_failed', [
            'webhook_url' => $webhookUrl,
            'origin' => $payload['origin'],
            'chat_id' => $chat_id,
            'error_code' => $curl_errno,
            'error_message' => $curl_error,
            'error_data' => [
                'connect_timeout' => 10,
                'timeout' => 0,
            ],
        ]);
        wp_send_json_error(['error' => 'Failed to connect to service'], 500);
    }

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
