<?php
// Récupérer les données JSON actuelles depuis le fichier
$currentData = file_get_contents('countdowns.json');
$countdowns = json_decode($currentData, true);

// Récupérer les données de la requête POST
$data = json_decode(file_get_contents('php://input'), true);

// Vérifier si toutes les clés nécessaires sont présentes
$requiredKeys = ['index', 'targetDate', 'matiere', 'nomProfesseur', 'descriptionDevoir', 'UE', 'couleurUE'];
if (array_diff($requiredKeys, array_keys($data)) === []) {
    // Récupérer l'index du countdown à mettre à jour
    $index = $data['index'];

    // Vérifier si l'index existe dans le tableau des countdowns
    if (isset($countdowns[$index])) {
        // Mettre à jour seulement les données spécifiées
        foreach ($data as $key => $value) {
            $countdowns[$index][$key] = $value;
        }

        // Réécrire le fichier JSON avec les données mises à jour
        file_put_contents('countdowns.json', json_encode($countdowns, JSON_PRETTY_PRINT));

        // Retourner les countdowns mis à jour
        echo json_encode($countdowns, JSON_PRETTY_PRINT);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid index']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data']);
}
?>
