<?php
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['index'])) {
    $index = $data['index'];
    $countdowns = json_decode(file_get_contents('countdowns.json'), true);

    if (isset($countdowns[$index])) {
        unset($countdowns[$index]);

        file_put_contents('countdowns.json', json_encode(array_values($countdowns), JSON_PRETTY_PRINT));

        // Retourner les countdowns mis à jour
        echo json_encode(array_values($countdowns), JSON_PRETTY_PRINT);
    } else {
        http_response_code(400);
        echo json_encode(array('error' => 'Invalid index'));
    }
} else {
    http_response_code(400);
    echo json_encode(array('error' => 'Invalid data'));
}
?>
