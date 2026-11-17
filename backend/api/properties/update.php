<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

setCorsHeaders();

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'PUT' || $method === 'POST') {
    $inputData = json_decode(file_get_contents("php://input"), true) ?: $_POST;

    if (empty($inputData['id'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Property ID is required for update."]);
        exit();
    }

    try {
        $sql = "UPDATE properties SET 
                title = :title, 
                description = :description, 
                price = :price, 
                location = :location, 
                property_type = :property_type, 
                land_area = :land_area, 
                building_area = :building_area, 
                bedrooms = :bedrooms, 
                bathrooms = :bathrooms, 
                status = :status, 
                image_url = :image_url 
                WHERE id = :id";
        
        $stmt = $db->prepare($sql);
        $result = $stmt->execute([
            ':id' => (int)$inputData['id'],
            ':title' => $inputData['title'],
            ':description' => $inputData['description'] ?? '',
            ':price' => (float)$inputData['price'],
            ':location' => $inputData['location'],
            ':property_type' => $inputData['property_type'] ?? 'Tanah',
            ':land_area' => (int)($inputData['land_area'] ?? 0),
            ':building_area' => (int)($inputData['building_area'] ?? 0),
            ':bedrooms' => (int)($inputData['bedrooms'] ?? 0),
            ':bathrooms' => (int)($inputData['bathrooms'] ?? 0),
            ':status' => $inputData['status'] ?? 'Tersedia',
            ':image_url' => $inputData['image_url'] ?? ''
        ]);

        if ($stmt->rowCount() > 0) {
            echo json_encode([
                "status" => "success",
                "message" => "Property updated successfully"
            ]);
        } else {
            echo json_encode([
                "status" => "success",
                "message" => "Property updated (or no changes detected)"
            ]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
