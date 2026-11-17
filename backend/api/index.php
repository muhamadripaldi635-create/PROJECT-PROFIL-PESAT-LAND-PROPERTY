<?php
require_once __DIR__ . '/../config/cors.php';
setCorsHeaders();

echo json_encode([
    "app" => "Pesat Land Property API",
    "version" => "1.0.0",
    "status" => "online",
    "timestamp" => date("Y-m-d H:i:s"),
    "endpoints" => [
        "GET /backend/api/properties/index.php" => "List all properties (supports ?type=..., ?search=..., ?min_price=..., ?max_price=...)",
        "POST /backend/api/properties/index.php" => "Create a new property",
        "PUT|POST /backend/api/properties/update.php" => "Update existing property details",
        "DELETE|POST /backend/api/properties/delete.php" => "Delete property by ID",
        "GET /backend/api/inquiries/index.php" => "List customer inquiries",
        "POST /backend/api/inquiries/index.php" => "Submit a new inquiry"
    ]
]);
