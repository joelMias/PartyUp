<?php
include('../connexio.php');
session_start();

$domini= "http://localhost/projecte/PartyUpRepo"; 
$ruta_retorn = $domini . "/backend/api/auth/steam.php";

if (!isset($_GET['openid_mode'])) {
    $params = [
        'openid.ns'         => 'http://specs.openid.net/auth/2.0',
        'openid.mode'       => 'checkid_setup',
        'openid.return_to'  => $ruta_retorn,
        'openid.realm'      => $domini,
        'openid.identity'   => 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.claimed_id' => 'http://specs.openid.net/auth/2.0/identifier_select',
    ];

    $url = 'https://steamcommunity.com/openid/login?' . http_build_query($params);
    header('Location: ' . $url);
    exit;
} 

else {
    if (empty($_GET['openid_claimed_id'])) {
        header("Location: http://localhost:5173/login?steam=invalid-response");
        exit;
    }

    $id_url = $_GET['openid_claimed_id']; 
    $steamid = basename($id_url); 

    if (empty($_SESSION['user_id'])) {
        try {
            $stmt = $pdo->prepare("SELECT id, username FROM users WHERE steam_id = ? LIMIT 1");
            $stmt->execute([$steamid]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['user_steamid'] = $steamid;
                $_SESSION['logged_in'] = true;
                header("Location: http://localhost:5173/dashboard?steam=login-success");
                exit;
            }

            header("Location: http://localhost:5173/login?steam=missing-session");
            exit;
        } catch (PDOException $e) {
            header("Location: http://localhost:5173/login?steam=update-error");
            exit;
        }
    }

    try {
        $stmt = $pdo->prepare("UPDATE users SET steam_id = ? WHERE id = ?");
        $stmt->execute([$steamid, $_SESSION['user_id']]);
    } catch (PDOException $e) {
        header("Location: http://localhost:5173/dashboard?steam=update-error");
        exit;
    }


    $_SESSION['user_steamid'] = $steamid;
    $_SESSION['logged_in'] = true;

    header("Location: http://localhost:5173/dashboard?steam=connected");
    exit;
}
?>