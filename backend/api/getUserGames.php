<?php
include('connexio.php');

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

session_start();

if (empty($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}

$envPath = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . '.env';
$envVars = [];
if (file_exists($envPath)) {
    $envVars = parse_ini_file($envPath, false, INI_SCANNER_RAW) ?: [];
}

$api_key = getenv('STEAM_API_KEY');
if (!$api_key && isset($envVars['STEAM_API_KEY'])) {
    $api_key = $envVars['STEAM_API_KEY'];
}

if (empty($api_key)) {
    echo json_encode(["status" => "error", "message" => "Missing STEAM_API_KEY"]);
    exit;
}

$steam_id = $_SESSION['user_steamid'] ?? null;
if (empty($steam_id)) {
    $stmtSteam = $pdo->prepare("SELECT steam_id FROM users WHERE id = ? LIMIT 1");
    $stmtSteam->execute([$_SESSION['user_id']]);
    $steam_id = $stmtSteam->fetchColumn();

    if (!empty($steam_id)) {
        $_SESSION['user_steamid'] = $steam_id;
    }
}

if (empty($steam_id)) {
    echo json_encode(["status" => "error", "message" => "Steam account not connected"]);
    exit;
}

function safe_fetch(string $url, int $timeoutSeconds = 10)
{
    $context = stream_context_create([
        'http' => [
            'timeout' => $timeoutSeconds,
            'ignore_errors' => true,
        ],
    ]);

    $response = @file_get_contents($url, false, $context);
    if ($response === false) {
        return false;
    }

    return $response;
}

$url = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key={$api_key}&steamid={$steam_id}&include_appinfo=true&include_played_free_games=true&format=json";

$response = safe_fetch($url);
if ($response === FALSE) {
    echo json_encode(["status" => "error", "message" => "Failed to fetch games from Steam API"]);
    exit;
}

$data = json_decode($response, true);
if (!isset($data['response']['games'])) {
    echo json_encode(["status" => "error", "message" => "No games found for this user"]);
    exit;
}

$gamesGlobal = $pdo->prepare("SELECT steam_appid FROM games");
$gamesGlobal->execute();
$gamesGlobalArray = array_column($gamesGlobal->fetchAll(PDO::FETCH_ASSOC), 'steam_appid');

$myGames = $pdo->prepare("SELECT steam_appid FROM user_games WHERE user_id = ?");
$myGames->execute([$_SESSION['user_id']]);
$myGamesArray = array_column($myGames->fetchAll(PDO::FETCH_ASSOC), 'steam_appid');

$tagsGlobal = $pdo->prepare("SELECT id FROM tags");
$tagsGlobal->execute();
$tagsGlobalArray = array_column($tagsGlobal->fetchAll(PDO::FETCH_ASSOC), 'id');

$categoriesGlobal = $pdo->prepare("SELECT id FROM genres");
$categoriesGlobal->execute();
$categoriesGlobalArray = array_column($categoriesGlobal->fetchAll(PDO::FETCH_ASSOC), 'id');

foreach ($data['response']['games'] as $game) {
    $appid = $game['appid'];

    if (!in_array($appid, $myGamesArray)) {
        if (!in_array($appid, $gamesGlobalArray)) {

            $detailsUrl = "https://store.steampowered.com/api/appdetails?appids={$appid}";
            $detailsResponse = safe_fetch($detailsUrl);

            if ($detailsResponse !== FALSE) {
                $detailsData = json_decode($detailsResponse, true);
                if (isset($detailsData[$appid]['success']) && $detailsData[$appid]['success']) {
                    $info = $detailsData[$appid]['data'];

                    if (isset($info['categories'])) {
                        foreach ($info['categories'] as $cat) {
                            $insertCategorie= $pdo->prepare("INSERT IGNORE INTO genres (id, name) VALUES (?, ?)");
                            $insertCategorie->execute([$cat['id'], $cat['description'] ?? '']);

                            $insertGameCategory = $pdo->prepare("INSERT IGNORE INTO game_genres (steam_appid, genre_id) VALUES (?, ?)");
                            $insertGameCategory->execute([$appid, $cat['id']]);
                        }
                    }

                    if (isset($info['tags'])) {
                        foreach ($info['tags'] as $tag) {
                            $insertCategorie= $pdo->prepare("INSERT IGNORE INTO tags (id, name) VALUES (?, ?)");
                            $insertCategorie->execute([$tag['id'], $tag['description'] ?? '']);

                            $insertGameTag = $pdo->prepare("INSERT IGNORE INTO game_tags (steam_appid, tag_id) VALUES (?, ?)");
                            $insertGameTag->execute([$appid, $tag['id']]);
                        }
                    }

                    $insertGlobalGame = $pdo->prepare("
                        INSERT IGNORE INTO games (steam_appid, name, cover_url) 
                        VALUES (?, ?, ?)
                    ");
                    $cover = $game['img_icon_url'] ?? '';
                    $insertGlobalGame->execute([$appid, $info['name'], $cover]);

                    $gamesGlobalArray[] = $appid;
                }
            }
        }

        $insertMyGame = $pdo->prepare("
            INSERT IGNORE INTO user_games (user_id, steam_appid, playtime_forever, playtime_2weeks, is_active) 
            VALUES (?, ?, ?, ?, 1)
        ");
        $insertMyGame->execute([
            $_SESSION['user_id'], 
            $appid, 
            $game['playtime_forever'] ?? 0, 
            $game['playtime_2weeks'] ?? 0
        ]);
        $myGamesArray[] = $appid;
    }
}

echo json_encode(["status" => "ok", "message" => "Games synchronized"]);

?>