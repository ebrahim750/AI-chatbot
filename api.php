<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// 1. Get API Key securely
$apiKey = 'AIzaSyC-xN44oj5US7OCF3glcCscp7spiKPdJFc'; 
if (!$apiKey) {
    // Return an internal server error if the key isn't configured
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error: Gemini API Key not found.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['message']) || empty(trim($input['message']))) {
    http_response_code(400);
    echo json_encode(['error' => 'Message is required']);
    exit;
}

$message = trim($input['message']);
$chatHistory = $input['history'] ?? [];

// 2. Gemini REST API URL configuration
$apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";


$systemContext = "
You are the official AI booking assistant for 'Skydive Zanzibar', a professional skydiving company in Zanzibar, Tanzania.  
Your only purpose is to answer user questions based on the company information provided below.

COMPANY INFORMATION:
1. Skydive Zanzibar offers tandem skydiving with certified instructors.  
2. Customers can book jumps in advance; availability may depend on weather conditions.  
3. There are age and weight limits for safety reasons (age 18+, max weight approx. 100kg/220lbs).  
4. Safety is a top priority: all equipment is regularly inspected, and instructors are fully licensed.  
5. Photo and video packages are available for an additional cost.  
6. Skydive Zanzibar operates in Zanzibar, offering breathtaking views of beaches and the ocean.  
7. Customers should arrive early, bring comfortable clothing, and follow staff instructions at all times.  

STRICT RULE:  
- If the user asks any question that is NOT covered, politely explain that you cannot answer and state that you happy to help with company information or booking assistance. This response should not be too long.
";

$systemContext = str_replace(["\r\n", "\r"], "\n", trim($systemContext));


// Build conversation context for Gemini
$contents = [];

// Add chat history to provide context
foreach ($chatHistory as $msg) {
    $contents[] = [
        'parts' => [
            ['text' => $msg['text']]
        ],
        'role' => $msg['role'] === 'user' ? 'user' : 'model'
    ];
}

// Add the current message
$contents[] = [
    'parts' => [
        ['text' => $message]
    ],
    'role' => 'user'
];

// Final payload
$data = [
    'contents' => $contents,
    'systemInstruction' => [
        'parts' => [['text' => $systemContext]]
    ],
    'generationConfig' => [
        'temperature' => 0.7
    ]
];

// 3. Use the preferred x-goog-api-key header for authentication
$options = [
    'http' => [
        'header' => "Content-Type: application/json\r\n" .
                    "x-goog-api-key: {$apiKey}\r\n", 
        'method' => 'POST',
        'content' => json_encode($data)
    ]
];

$context = stream_context_create($options);
// 4. Corrected call: pass $apiUrl directly
$response = @file_get_contents($apiUrl, false, $context); 

if ($response === false) {
    http_response_code(500);
    // Use $http_response_header to get more error details if needed
    echo json_encode(['error' => 'Failed to connect to Gemini API or request error.']);
    exit;
}

$responseData = json_decode($response, true);

// Check for API-side errors (e.g., INVALID_ARGUMENT, PERMISSION_DENIED)
if (isset($responseData['error'])) {
    http_response_code($responseData['error']['code'] ?? 500);
    echo json_encode(['error' => $responseData['error']['message'] ?? 'Gemini API returned an error.']);
    exit;
}

if (isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
    $botResponse = $responseData['candidates'][0]['content']['parts'][0]['text'];
    echo json_encode(['response' => $botResponse]);
} else {
    // This catches cases where the API returns a success (200) but without the expected text part
    http_response_code(500);
    echo json_encode(['error' => 'Invalid or incomplete response structure from Gemini API.']);
}