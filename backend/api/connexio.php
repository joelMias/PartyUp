<?php
//Connexio a la base de dades:
$host = "localhost";
$port = 3306;
$dbname = "party-up";
$user = "root";
$pass = "";


//Provem de fer la connexió a la base de dades. En cas de que funcioni estarem connectats i en cas de que no retornem l'error al React
try {
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Server error"
    ]);
    exit;
}

?>