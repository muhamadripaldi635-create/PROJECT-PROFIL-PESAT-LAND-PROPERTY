<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

setCorsHeaders();

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'DELETE' || $method === 'POST') {
    $inputData = json_decode(file_get_contents("php://input"), true) ?: $_POST;
    $id = !empty($inputData['id']) ? $inputData['id'] : ($_GET['id'] ?? null);

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Property ID is required for deletion."]);
        exit();
    }

    try {
        $stmt = $db->prepare("DELETE FROM properties WHERE id = :id");
        $stmt->execute([':id' => (int)$id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode([
                "status" => "success",
                "message" => "Property deleted successfully"
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                "status" => "error",
                "message" => "Property not found"
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
