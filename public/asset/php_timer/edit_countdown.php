<?php
// Récupérer les valeurs des paramètres de l'URL
$index = $_GET['index'];
$targetDate = $_GET['targetDate'];
$matiere = $_GET['matiere'];
$nomProfesseur = $_GET['nomProfesseur'];
$descriptionDevoir = $_GET['descriptionDevoir'];
$UE = $_GET['UE'];
$couleurUE = $_GET['couleurUE'];
?>

<html lang="en">
<head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="countdown.js"></script>
    <script>
      
        document.addEventListener('DOMContentLoaded', function () {
            document.getElementById('editTargetDate').value = '<?php echo date('Y-m-d\TH:i', $targetDate); ?>';
            document.getElementById('editMatiere').value = '<?php echo $matiere; ?>';
            document.getElementById('editNomProfesseur').value = '<?php echo $nomProfesseur; ?>';
            document.getElementById('editDescriptionDevoir').value = '<?php echo $descriptionDevoir; ?>';
            document.getElementById('editUE').value = '<?php echo $UE; ?>';
            document.getElementById('editCouleurUE').value = '<?php echo $couleurUE; ?>';
        });

        function updateCountdown(index) {
            // Récupérez les valeurs modifiées depuis le formulaire
            const editedTargetDate = new Date(document.getElementById('editTargetDate').value);
            const editedMatiere = document.getElementById('editMatiere').value;
            const editedNomProfesseur = document.getElementById('editNomProfesseur').value;
            const editedDescriptionDevoir = document.getElementById('editDescriptionDevoir').value;
            const editedUE = document.getElementById('editUE').value;
            const editedCouleurUE = document.getElementById('editCouleurUE').value;

            // Utilisez une requête AJAX pour mettre à jour le compteur sur le serveur
            fetch('update_countdown.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    index,
                    targetDate: editedTargetDate.getTime(),
                    matiere: editedMatiere,
                    nomProfesseur: editedNomProfesseur,
                    descriptionDevoir: editedDescriptionDevoir,
                    UE: editedUE,
                    couleurUE: editedCouleurUE,
                }),
            })
            .then(response => response.json())
            .then(updatedCountdowns => {
                // Mettez à jour les compteurs après la modification
                updateTimers(updatedCountdowns);
                // Redirigez vers la page d'accueil après la modification
                goToIndexPage();
            })
            .catch(error => console.error('Error updating countdown:', error));
        }

        function goToIndexPage() {
            // Vous pouvez personnaliser la redirection ici
            window.location.href = 'index.php';
        }
    </script>
</head>

<body>

<?php
require ('header.php');
?>

</body>

<div class="modif">
<form id="editCountdownForm">
    <div><label for="editTargetDate">Date : </label>
    <input type="datetime-local" id="editTargetDate" value="<?php echo date('Y-m-d\TH:i', $targetDate); ?>" required></div>

    <input type="text" id="editMatiere" placeholder="Matière" value="<?php echo $matiere; ?>" required>

    <input type="text" id="editNomProfesseur" placeholder="Professeur" value="<?php echo $nomProfesseur; ?>" required>

    <textarea id="editDescriptionDevoir" placeholder="Description" required><?php echo $descriptionDevoir; ?></textarea>

    <div><label for="editUE">UE : </label>
    <input type="text" id="editUE" value="<?php echo $UE; ?>" required></div>

    <label for="editCouleurUE">Couleur UE : </label>
    <select id="editCouleurUE" required>
        <option value="red" <?php if ($couleurUE === 'red') echo 'selected'; ?>>Rouge</option>
        <option value="green" <?php if ($couleurUE === 'green') echo 'selected'; ?>>Vert</option>
        <option value="blue" <?php if ($couleurUE === 'blue') echo 'selected'; ?>>Bleu</option>
        <option value="purple" <?php if ($couleurUE === 'purple') echo 'selected'; ?>>Violet</option>
        <option value="yellow" <?php if ($couleurUE === 'yellow') echo 'selected'; ?>>Jaune</option>
    </select>

    <button type="button" onclick="updateCountdown(<?php echo $index; ?>)">Enregistrer les modifications</button>
    <button type="button" onclick="goToIndexPage()">Retour à la page d'accueil</button>

</form>
</div>

<footer>
    <p>&copy; 2023 EduBook.com <br><a href="contact.php">Contactez nous</a></p>
</footer>

</html>
