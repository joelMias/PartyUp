<?php
include('connexio.php');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$allowedFields = ["username", "email", "region"];

if (!in_array($data["field"], $allowedFields)) {
    echo json_encode(["status" => "error", "message" => "Campo no permitido"]);
    exit;
}

$stmt = $pdo->prepare("UPDATE users SET $data[field] = ? WHERE id = ?");
$stmt->execute([$data["value"], $data["id"]]);

echo json_encode(["status" => "success"]);
?>