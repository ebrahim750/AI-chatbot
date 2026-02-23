<?php
$webhookTestUrl = 'https://ai-backend.simplyask.live/webhook-test/a26d6589-c02d-4907-9ae1-093ddf572aa9';
$webhookProdUrl = 'https://ai-backend.simplyask.live/webhook/a26d6589-c02d-4907-9ae1-093ddf572aa9';
$prod = false;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

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
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to connect to webhook: ' . $error]);
    exit;
}

if ($httpCode < 200 || $httpCode >= 300) {
    http_response_code($httpCode);
    echo json_encode(['error' => 'Webhook returned error: ' . $response]);
    exit;
}

$responseData = json_decode($response, true);

if (!isset($responseData['response'])) {
    if (is_array($responseData) && isset($responseData[0]['output'])) {
        echo json_encode(['response' => $responseData[0]['output']]);
        exit;
    }
    http_response_code(500);
    echo json_encode(['error' => 'Invalid response format from webhook']);
    exit;
}

echo json_encode(['response' => $responseData['response']]);
