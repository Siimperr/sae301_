<?php
$data = json_decode(file_get_contents('php://input'), true);
$newCountdown = array(
    'targetDate' => $data['targetDate'],
    'matiere' => $data['matiere'],
    'nomProfesseur' => $data['nomProfesseur'],
    'descriptionDevoir' => $data['descriptionDevoir'],
    'UE' => $data['UE'],
    'couleurUE' => $data['couleurUE']
);

$countdowns = json_decode(file_get_contents('countdowns.json'), true);

// Ajouter le nouveau compte à rebours
$countdowns[] = $newCountdown;

// Mettre à jour le fichier JSON après l'ajout
file_put_contents('countdowns.json', json_encode($countdowns));

// Retourner la liste mise à jour
echo json_encode($countdowns);
?>