<?php
include('connexio.php');


//Nose que fa pero es per evitar que el PHP imprimeixi  HTML per warnings o notices
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);


//Per permetre peticions desde React
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

//Llegir el JSON que enviar React
$data = json_decode(file_get_contents("php://input"), true); //aixo llegei el contingut de la peticio i el true fa que retorni array i no un objecte


//Comprovo que les dades hagin arribat correctament, en el cas de que no, li passo al React que no hi ha hagut èxit
if ((empty($data["email"]) && empty($data["username"])) || empty($data["password"])) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);
    exit;
}


//En cas de que hagin arribat bé les dades:
$email = $data["email"];
$username = $data["username"];
$password = $data["password"];
$eu = $data["eu"];

$stmt;

if(!empty($email)){
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
}
else{
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
}

$user = $stmt->fetch(PDO::FETCH_ASSOC);

// si usuari no existeix
if (!$user) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid credentials"
    ]);
    exit;
}

if (!password_verify($password, $user["password"])) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid credentials"
    ]);
    exit;
}

/*if ($password !== $user["password"]) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid credentials"
    ]);
    exit;
}*/
    

// Login OK
echo json_encode([
    "success" => true,
    "userId" => $user["id"],
    "username" => $user["username"],
    "state" => "connected",
    "description" => "Steam not connected"
]);