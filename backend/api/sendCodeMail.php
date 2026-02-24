<?php
//Nose que fa pero es per evitar que el PHP imprimeixi  HTML per warnings o notices
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);


header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require __DIR__ . '/vendor/autoload.php'; // Importar Composer autoload
use Resend\Resend;

$mail = json_decode(file_get_contents("php://input"), true);

if(!$email || empty($mail['email'])){
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);
    exit;
}

$email = $mail['email'];

//Inicialitzem el resend
$resend = Resend::client('re_UffhEhPY_3eCFzoK8bFhReUzYfpYAy2bP');

//Generem un codi aleatori:
$code = rand(100000, 999999);

try {
    // Cridem a Resend per enviar el correu amb el codi de reset
    $resend->emails->send([
        'from' => 'onboarding@resend.dev',  // Adreça de l'emissor
        'to' => $email,                      // Adreça del destinatari (l'usuari)
        'subject' => 'Password reset code', // Assumpte del correu
        'html' => "<p>Your password reset code is: <strong>$code</strong></p>" // Cos del correu amb codi
    ]);

    // Si tot ha anat bé, retornem un JSON indicant èxit
    echo json_encode([
        "success" => true,
        "message" => "Code sended",
        "code" => $code //retornem el codi per testos o debug
    ]);
} catch (\Exception $e) {
    // Si hi ha algun error enviant el correu, capturem l'excepció
    // i retornem un missatge d'error amb JSON
    echo json_encode([
        "success" => false,
        "message" => "Error sending email: " . $e->getMessage()
    ]);
}
?>