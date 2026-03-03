<?php

# configs
$webhookTestUrl = 'https://ai-backend.simplyask.live/webhook-test/facd547d-5e9b-4f70-9970-ac17be2823b1';
$webhookProdUrl = 'https://ai-backend.simplyask.live/webhook/facd547d-5e9b-4f70-9970-ac17be2823b1';
$prod = true;

$logFile = __DIR__ . '/error.log';

function logError($message, $details = []) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] $message";
    if (!empty($details)) {
        $logEntry .= " | Details: " . json_encode($details);
    }
    $logEntry .= "\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND);
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    logError('Invalid JSON input', ['json_error' => json_last_error_msg(), 'raw_input' => file_get_contents('php://input')]);
    echo json_encode(['error' => 'Invalid request']);
    exit;
}

if (!isset($input['message']) || !isset($input['chat_id']) || empty(trim($input['message']))) {
    http_response_code(400);
    echo json_encode(['error' => 'Message and chat_id are required']);
    exit;
}

$message = trim($input['message']);
$chat_id = $input['chat_id'];

$webhookUrl = $prod ? $webhookProdUrl : $webhookTestUrl;

$ch = curl_init($webhookUrl);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['message' => $message, 'chat_id' => $chat_id]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    logError('cURL error', ['curl_error' => $curlError, 'http_code' => $httpCode]);
    echo json_encode(['error' => 'Failed to connect to service']);
    exit;
}

if ($httpCode < 200 || $httpCode >= 300) {
    http_response_code($httpCode);
    logError('Webhook error', ['http_code' => $httpCode, 'response' => $response]);
    echo json_encode(['error' => 'Service temporarily unavailable']);
    exit;
}

$responseData = json_decode($response, true);

if (!isset($responseData['response'])) {
    if (is_array($responseData) && isset($responseData[0]['output'])) {
        echo json_encode(['response' => $responseData[0]['output']]);
        exit;
    }
    http_response_code(500);
    logError('Invalid response format', ['response' => $response]);
    echo json_encode(['error' => 'Invalid response from service']);
    exit;
}

echo json_encode(['response' => $responseData['response']]);

?>
