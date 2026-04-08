<?php
include('connexio.php');

$userId = json_decode(file_get_contents("php://input"), true);

if (empty($userId)) {
    echo json_encode([
        "success" => false,
        "message" => "No content on fetch"
    ]);
    exit;
}

$stmt = $pdo ->prepare("INSERT INTO matches () VALUES();");

?>