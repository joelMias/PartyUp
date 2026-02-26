<?php
    session_start();
    include('connexio.php');

    $user_id = $_SESSION['user_id'] ?? -1;

    if($user_id == -1) {
        echo json_encode([]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT u.id, u.username, u.avatar_url AS avatar, u.state, bio AS description FROM users u
                            JOIN matches m 
                                ON ( (m.user1_id = u.id AND m.user2_id = ?) OR (m.user2_id = u.id AND m.user1_id = ?) );");
    $stmt->execute([$user_id, $user_id]);

    $matches = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo(json_encode($matches));
?>