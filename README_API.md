# Chatbot API Configuration

## Environment Setup

This project uses n8n webhook integration for the chatbot functionality. The webhook URLs are configured directly in `api.php` with support for test and production environments.

### Configuration

The webhook URLs and environment flag are set at the top of `api.php`:

```php
$webhookTestUrl = 'https://n8n.simplyit.africa/webhook-test/a26d6589-c02d-4907-9ae1-093ddf572aa9';
$webhookProdUrl = 'https://n8n.simplyit.africa/webhook/a26d6589-c02d-4907-9ae1-093ddf572aa9';
$prod = false;
```

### Switching Between Test and Production

To switch from test to production environment:

1. Open `api.php`
2. Change `$prod = false;` to `$prod = true;`
3. Save the file

### Configuration Variables

- `$webhookTestUrl`: The n8n test webhook URL
- `$webhookProdUrl`: The n8n production webhook URL
- `$prod`: Boolean flag (true/false) to select production or test environment

## API Endpoints

### POST /api.php

Sends a message to the appropriate n8n webhook (test or prod) and returns the response.

**Request Body:**
```json
{
  "message": "User message text"
}
```

**Response:**
```json
{
  "response": "Assistant response text"
}
```

**Error Response:**
```json
{
  "error": "Error message description"
}
```

## Server Requirements

- PHP 7.4 or higher
- cURL extension enabled
- Environment variable support ($_ENV)

## Security Notes

- The `.env` file is included in `.gitignore` to prevent committing sensitive URLs
- Ensure the `.env` file has proper permissions on production servers
