<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

setCorsHeaders();

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $sql = "SELECT i.*, p.title as property_title, p.location as property_location 
                FROM inquiries i 
                LEFT JOIN properties p ON i.property_id = p.id 
                ORDER BY i.id DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $inquiries = $stmt->fetchAll();

        echo json_encode([
            "status" => "success",
            "total" => count($inquiries),
            "data" => $inquiries
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $inputData = json_decode(file_get_contents("php://input"), true) ?: $_POST;

    if (empty($inputData['property_id']) || empty($inputData['customer_name']) || empty($inputData['phone']) || empty($inputData['message'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Property ID, customer name, phone number, and message are required."]);
        exit();
    }

    try {
        $sql = "INSERT INTO inquiries (property_id, customer_name, email, phone, message, status) 
                VALUES (:property_id, :customer_name, :email, :phone, :message, 'Baru')";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':property_id' => (int)$inputData['property_id'],
            ':customer_name' => trim($inputData['customer_name']),
            ':email' => trim($inputData['email'] ?? ''),
            ':phone' => trim($inputData['phone']),
            ':message' => trim($inputData['message'])
        ]);

        $newId = $db->lastInsertId();

        http_response_code(201);
        echo json_encode([
            "status" => "success",
            "message" => "Pertanyaan/Pesan Anda berhasil terkirim! Tim Pesat Land akan segera menghubungi Anda.",
            "data" => ["id" => $newId]
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
