<?php

//Carpeta on esta el vendor (carpeta del composer)
require_once __DIR__ . '/../vendor/autoload.php';

//per recollir la funcio
require_once __DIR__ . '/../loader/env_loader.php';

chargeEnv();
function sendMail($reciver, $thing, $body){
    try {
        $key = getenv('RESEND_API_KEY');
        $resend = Resend::client($key);

        $resend->emails->send([
            'from' => 'Party-Up <onboarding@partyup.daw2.inspalamos.cat>',
            'to' => [$reciver],
            'subject' => $thing,
            'html' => $body
        ]);
        return true; 
    } catch (Exception $e) {
        error_log("Error enviando email: " . $e->getMessage());
        return false;
    }
}

?>