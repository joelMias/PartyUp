<?php
//Per permetre peticions desde React
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

//Llegir el JSON que enviar React
$data = json_decode(file_get_contents("php://input"), true); //aixo llegei el contingut de la peticio i el true fa que retorni array i no un objecte


//Comprovo que les dades hagin arribat correctament, en el cas de que no, li passo al React que no hi ha hagut èxit
if (empty($data["email"]) || empty($data["username"]) || empty($data["password"]) || empty($data["gender"]) || empty($data["date"])) {
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
$gender = $data["gender"];
$date = $data["date"];


//Encriptar la contrassenya:
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

//Connexio a la base de dades:
$host = "localhost";
$port = 3307;
$dbname = "partyup";
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

//Comprovarem si el correu ja existeix
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);

if ($stmt->fetch()) {
    echo json_encode([
        "success" => false,
        "message" => "Email already exists"
    ]);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
$stmt->execute([$username]);

if ($stmt->fetch()) {
    echo json_encode([
        "success" => false,
        "message" => "Username already exists"
    ]);
    exit;
}

//Insertar a la base de dades
$stmt = $pdo->prepare("
    INSERT INTO users (email, username, password, gender, birth_date)
    VALUES (?, ?, ?, ?, ?)
");

$success = $stmt->execute([
    $email,
    $username,
    $hashedPassword,
    $gender,
    $date
]);

if ($success) {
    echo json_encode([
        "success" => true
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Insert failed"
    ]);
}