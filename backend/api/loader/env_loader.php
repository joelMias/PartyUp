<?php

function chargeEnv(){
    $route = __DIR__ . '/env';
    if(file_exists($route)){
        $lines = file($route, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line){
            if(strpos(trim($line), '#') === 0) continue;

            list($name, $value) = explode('=', $line, 2);
            putenv(trim($name) . "=" . trim($value));
        }
    }
}

?>