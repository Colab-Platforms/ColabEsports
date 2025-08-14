<?php
/**
 * Meta Conversions API (CAPI) Handler for ColabEsports
 * This handles server-side event tracking to complement client-side pixel
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration - Replace with your actual values
define('META_PIXEL_ID', '2947992532049577');
define('META_ACCESS_TOKEN', 'EAASUY1jZCEyIBPM7z17W49s7aUxviW1hsfFpVJ0iigPINeVoFLcAyjxqMc7IWR8pZAZBfKv8wIxoThVjK6qp1oeUmpjAhsiz1euR3ZAOI1oA5i2ZCKBdGsGPKrzQGqtwxVSNwhtPaCzu6PJ5dxGoqZBobILVCJI0KlZBZCMxc4DaFkwEoKbZASvGCpLyeP850qqV5CAZDZD'); // Get from Meta Business Manager
define('META_API_VERSION', 'v18.0');

class MetaCAPI {
    private $pixelId;
    private $accessToken;
    private $apiUrl;
    
    public function __construct($pixelId, $accessToken) {
        $this->pixelId = $pixelId;
        $this->accessToken = $accessToken;
        $this->apiUrl = "https://graph.facebook.com/" . META_API_VERSION . "/{$pixelId}/events";
    }
    
    public function sendEvent($eventData) {
        $payload = [
            'data' => [$eventData],
            'access_token' => $this->accessToken
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->apiUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        return [
            'success' => $httpCode === 200,
            'response' => json_decode($response, true),
            'http_code' => $httpCode
        ];
    }
    
    private function hashUserData($userData) {
        $hashedData = [];
        
        // Hash email
        if (!empty($userData['email'])) {
            $hashedData['em'] = hash('sha256', strtolower(trim($userData['email'])));
        }
        
        // Hash phone
        if (!empty($userData['phone'])) {
            $phone = preg_replace('/\D/', '', $userData['phone']);
            $hashedData['ph'] = hash('sha256', $phone);
        }
        
        // Hash first name
        if (!empty($userData['first_name'])) {
            $hashedData['fn'] = hash('sha256', strtolower(trim($userData['first_name'])));
        }
        
        // Hash last name
        if (!empty($userData['last_name'])) {
            $hashedData['ln'] = hash('sha256', strtolower(trim($userData['last_name'])));
        }
        
        // Add non-hashed data
        if (!empty($userData['client_ip_address'])) {
            $hashedData['client_ip_address'] = $userData['client_ip_address'];
        }
        
        if (!empty($userData['client_user_agent'])) {
            $hashedData['client_user_agent'] = $userData['client_user_agent'];
        }
        
        if (!empty($userData['fbc'])) {
            $hashedData['fbc'] = $userData['fbc'];
        }
        
        if (!empty($userData['fbp'])) {
            $hashedData['fbp'] = $userData['fbp'];
        }
        
        return $hashedData;
    }
    
    public function processEvent($requestData) {
        // Get client IP
        $clientIp = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? 
                   $_SERVER['HTTP_X_REAL_IP'] ?? 
                   $_SERVER['REMOTE_ADDR'] ?? '';
        
        // Prepare user data
        $userData = $requestData['user_data'] ?? [];
        $userData['client_ip_address'] = $clientIp;
        
        // Hash sensitive user data
        $hashedUserData = $this->hashUserData($userData);
        
        // Prepare event data
        $eventData = [
            'event_name' => $requestData['event_name'],
            'event_time' => $requestData['timestamp'] ?? time(),
            'action_source' => $requestData['action_source'] ?? 'website',
            'event_source_url' => $requestData['event_source_url'] ?? '',
            'user_data' => $hashedUserData
        ];
        
        // Add custom data if present
        if (!empty($requestData['event_data'])) {
            $eventData['custom_data'] = $requestData['event_data'];
        }
        
        // Add test event code if in test mode
        if (defined('META_TEST_EVENT_CODE') && META_TEST_EVENT_CODE) {
            $eventData['test_event_code'] = META_TEST_EVENT_CODE;
        }
        
        return $this->sendEvent($eventData);
    }
}

// Main handler
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $input = file_get_contents('php://input');
        $requestData = json_decode($input, true);
        
        if (!$requestData) {
            throw new Exception('Invalid JSON data');
        }
        
        if (empty($requestData['event_name'])) {
            throw new Exception('Event name is required');
        }
        
        $capi = new MetaCAPI(META_PIXEL_ID, META_ACCESS_TOKEN);
        $result = $capi->processEvent($requestData);
        
        if ($result['success']) {
            echo json_encode([
                'success' => true,
                'message' => 'Event sent successfully',
                'data' => $result['response']
            ]);
        } else {
            throw new Exception('Failed to send event: ' . json_encode($result['response']));
        }
        
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
}
?>
