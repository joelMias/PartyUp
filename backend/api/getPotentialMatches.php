<?php
include('connexio.php');

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

session_start();

try {
    if (empty($_SESSION['user_id'])) {
        echo json_encode(["status" => "error", "message" => "User not logged in"]);
        exit;
    }

    $current_user_id = $_SESSION['user_id'];

    $stmt_user = $pdo->prepare("SELECT region, play_style FROM users WHERE id = :current_user_id");
    $stmt_user->execute(['current_user_id' => $current_user_id]);
    $user_data = $stmt_user->fetch(PDO::FETCH_ASSOC);

    $user_region = $user_data['region'] ?? null;
    $current_play_style = $user_data['play_style'] ?? null;

    $stmt = $pdo->prepare("
        SELECT 
            u.*,
            COUNT(ug.steam_appid) AS common_games_count,
            GROUP_CONCAT(CONCAT(ug.steam_appid, '|', COALESCE(g.cover_url, '')) ORDER BY ug.steam_appid ASC SEPARATOR ',') AS common_game_images
        FROM users u
        JOIN user_games ug ON ug.user_id = u.id
        JOIN user_games my_games 
            ON my_games.steam_appid = ug.steam_appid 
           AND my_games.user_id = :current_user_id
        LEFT JOIN games g ON g.steam_appid = ug.steam_appid
        WHERE u.id != :current_user_id
          AND u.id NOT IN (SELECT user_to FROM swipes WHERE user_from = :current_user_id)
          AND u.id NOT IN (
              SELECT user1_id FROM matches WHERE user1_id = :current_user_id
              UNION
              SELECT user2_id FROM matches WHERE user2_id = :current_user_id
          )
          AND u.region = :region
          AND (
              :current_play_style = 'both'
              OR u.play_style = 'both'
              OR u.play_style = :current_play_style
          )
        GROUP BY u.id
        ORDER BY common_games_count DESC
    ");

    $stmt->execute([
        'current_user_id' => $current_user_id,
        'region' => $user_region,
        'current_play_style' => $current_play_style
    ]);

    $potentialMatchesRaw = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $potentialMatches = array_map(function ($user) {
        if (empty($user['common_game_images'])) {
            $user['common_game_images'] = [];
            return $user;
        }

        $items = array_filter(explode(',', $user['common_game_images']));
        $images = [];

        foreach ($items as $item) {
            $parts = explode('|', $item, 2);
            $appid = $parts[0] ?? '';
            $cover = $parts[1] ?? '';

            if ($cover === '') {
                continue;
            }

            // Old rows may store only Steam icon hash instead of a full URL.
            if (!preg_match('/^https?:\/\//i', $cover)) {
                $cover = "https://media.steampowered.com/steamcommunity/public/images/apps/{$appid}/{$cover}.jpg";
            }

            $images[] = $cover;

            if (count($images) >= 3) {
                break;
            }
        }

        $user['common_game_images'] = $images;
        return $user;
    }, $potentialMatchesRaw);

    echo json_encode([
        "status" => "success",
        "potential_matches" => $potentialMatches
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Internal server error"
    ]);
}
?>