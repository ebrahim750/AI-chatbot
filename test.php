<?php
header('Content-Type: application/json');

$apiKey = 'AIzaSyC-xN44oj5US7OCF3glcCscp7spiKPdJFc';

echo $apiKey;


if (empty($apiKey)) {
    http_response_code(500);
    echo json_encode(['error' => 'Missing API key']);
    exit;
}

$systemText = "You are a support bot for the ACME internal policy manual. Answer only based on policy info.";

$payload = [
    'contents' => [
        [
            'role' => 'user',
            'parts' => [
                ['text' => 'How many vacation days do employees get per year?']
            ]
        ]
    ],
    'systemInstruction' => [
        'parts' => [
            ['text' => $systemText]
        ]
    ],
    'generationConfig' => [
        'temperature' => 0.0
    ]
];

$apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
$options = [
    'http' => [
        'header'  => "Content-Type: application/json\r\n" .
                     "x-goog-api-key: {$apiKey}\r\n",
        'method'  => 'POST',
        'content' => json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
    ]
];

$context = stream_context_create($options);
$response = @file_get_contents($apiUrl, false, $context);

if ($response === false) {
    $err = error_get_last();
    $statusLine = $http_response_header[0] ?? 'No HTTP status';
    http_response_code(500);
    echo json_encode([
        'error' => 'Request failed',
        'status_line' => $statusLine,
        'php_error' => $err['message'] ?? ''
    ]);
    exit;
}

$data = json_decode($response, true);
echo json_encode(['api_response' => $data]);
