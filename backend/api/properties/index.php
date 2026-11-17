<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

setCorsHeaders();

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // List and filter properties
    try {
        $stmt = $db->query("SELECT * FROM properties ORDER BY id DESC");
        $properties = $stmt->fetchAll();

        // Apply optional manual overrides and additions from the project data file.
        $manualDataPath = __DIR__ . '/../../data/properties.json';
        if (is_file($manualDataPath)) {
            $manualData = json_decode(file_get_contents($manualDataPath), true);
            if (is_array($manualData)) {
                $overrides = [];
                foreach (($manualData['properties'] ?? []) as $manualProperty) {
                    if (!empty($manualProperty['id'])) {
                        $overrides[(int)$manualProperty['id']] = $manualProperty;
                    }
                }

                foreach ($properties as &$property) {
                    $propertyId = (int)$property['id'];
                    if (isset($overrides[$propertyId])) {
                        $property = array_merge($property, $overrides[$propertyId]);
                    }
                }
                unset($property);

                $nextManualId = 1000000;
                foreach (($manualData['additions'] ?? []) as $manualProperty) {
                    if (!is_array($manualProperty) || empty($manualProperty['title'])) {
                        continue;
                    }
                    $manualProperty['id'] = $nextManualId++;
                    $manualProperty['description'] = $manualProperty['description'] ?? '';
                    $manualProperty['price'] = (float)($manualProperty['price'] ?? 0);
                    $manualProperty['location'] = $manualProperty['location'] ?? '';
                    $manualProperty['property_type'] = $manualProperty['property_type'] ?? 'Tanah';
                    $manualProperty['land_area'] = (int)($manualProperty['land_area'] ?? 0);
                    $manualProperty['building_area'] = (int)($manualProperty['building_area'] ?? 0);
                    $manualProperty['bedrooms'] = (int)($manualProperty['bedrooms'] ?? 0);
                    $manualProperty['bathrooms'] = (int)($manualProperty['bathrooms'] ?? 0);
                    $manualProperty['status'] = $manualProperty['status'] ?? 'Tersedia';
                    $manualProperty['image_url'] = $manualProperty['image_url'] ?? '';
                    array_unshift($properties, $manualProperty);
                }
            }
        }

        if (!empty($_GET['search'])) {
            $search = strtolower(trim($_GET['search']));
            $properties = array_values(array_filter($properties, function ($property) use ($search) {
                return str_contains(strtolower($property['title'] ?? ''), $search)
                    || str_contains(strtolower($property['location'] ?? ''), $search)
                    || str_contains(strtolower($property['description'] ?? ''), $search);
            }));
        }

        if (!empty($_GET['type']) && $_GET['type'] !== 'Semua') {
            $type = strtolower(trim($_GET['type']));
            $properties = array_values(array_filter($properties, fn ($property) => strtolower($property['property_type'] ?? '') === $type));
        }

        if (!empty($_GET['min_price']) && is_numeric($_GET['min_price'])) {
            $properties = array_values(array_filter($properties, fn ($property) => (float)$property['price'] >= (float)$_GET['min_price']));
        }
        if (!empty($_GET['max_price']) && is_numeric($_GET['max_price'])) {
            $properties = array_values(array_filter($properties, fn ($property) => (float)$property['price'] <= (float)$_GET['max_price']));
        }

        if (!empty($_GET['status'])) {
            $status = strtolower(trim($_GET['status']));
            $properties = array_values(array_filter($properties, fn ($property) => strtolower($property['status'] ?? '') === $status));
        }

        echo json_encode([
            "status" => "success",
            "total" => count($properties),
            "data" => $properties
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Create new property
    $inputData = json_decode(file_get_contents("php://input"), true) ?: $_POST;

    if (empty($inputData['title']) || empty($inputData['price']) || empty($inputData['location'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Title, price, and location are required."]);
        exit();
    }

    try {
        $sql = "INSERT INTO properties (title, description, price, location, property_type, land_area, building_area, bedrooms, bathrooms, status, image_url) 
                VALUES (:title, :description, :price, :location, :property_type, :land_area, :building_area, :bedrooms, :bathrooms, :status, :image_url)";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([
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
            ':image_url' => $inputData['image_url'] ?? 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'
        ]);

        $newId = $db->lastInsertId();

        http_response_code(201);
        echo json_encode([
            "status" => "success",
            "message" => "Property created successfully",
            "data" => ["id" => $newId]
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(45);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
