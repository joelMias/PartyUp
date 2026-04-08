<?php
include('connexio.php');

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

//Creació de token amb data de expiració
$token = bin2hex(random_bytes(32));

$now = new DateTime();
$now->add(new DateInterval('PT1H'));
$expiresAt = $now->format('Y-m-d H:i:s');

$url = "http://localhost:5173/verifyMail/";
$finalUrl= $url . $token;

$body = "
    <div style='font-family: Arial, sans-serif; line-height: 1.6;'>
        <h1>Verify Your Account in one click</h1>
        <p>Thanks for joining Party-Up! Click the button below to verify your email. This link will expire in 1 hour.</p>
        <a href='{$finalUrl}' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;'>
            Verify My Account
        </a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><small>{$finalUrl}</small></p>
    </div>
";


//Insertar a la base de dades
$stmt = $pdo->prepare("
    INSERT INTO users (email, username, password, gender, birth_date, email_verify_token, email_verify_expires_at, email_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");

$success = $stmt->execute([
    $email,
    $username,
    $hashedPassword,
    $gender,
    $date,
    $token,
    $expiresAt,
    false
]);

if ($success) {
    //Importem el arxiu per enviar el correu
    require_once(__DIR__ . '/auth/mailSender.php');

    $thing = "Verify your account - PartyUp";
    $sended = sendMail($email, $thing, $body);

    if($sended){
        echo json_encode([
            "success" => true,
            "message" => "Please, verify account via mail"
        ]);
    }
    else{
        echo json_encode([
            "success" => true, 
            "message" => "User created, but we couldn't send the email. Please try later."
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Insert failed"
    ]);
}