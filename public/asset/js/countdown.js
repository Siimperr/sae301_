
function addCountdown() {
    const newTargetDate = new Date(document.getElementById('newTargetDate').value);
    const nomProfesseur = document.getElementById('nomProfesseur').value;
    const descriptionDevoir = document.getElementById('descriptionDevoir').value;
    const UE = document.getElementById('UE').value;

    // Utiliser une requête AJAX pour ajouter le nouveau compteur sur le serveur (par exemple, avec fetch())
    fetch('add_countdown.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            targetDate: newTargetDate.getTime(),
            nomProfesseur,
            descriptionDevoir,
            UE,
        }),
    })
    .then(response => response.json())
    .then(countdowns => {
        // Mettre à jour les compteurs après l'ajout
        updateTimers(countdowns);
        // Rediriger vers la page d'accueil
        goToIndexPage();
    })
    .catch(error => console.error('Error adding countdown:', error));
}



let timerInterval; // Déclarez la variable globale pour stocker l'intervalle

function updateTimers(countdowns) {
    clearInterval(timerInterval);

    let timerText = "";

    if (Array.isArray(countdowns)) {
        countdowns.forEach((countdown, index) => {
            if (countdown && countdown.targetDate) {
                const targetDate = new Date(countdown.targetDate);
                const currentDate = new Date();
                const timeDifference = targetDate - currentDate;

                const isPastTargetDate = timeDifference <= 0;

                const days = Math.floor(Math.abs(timeDifference) / (1000 * 60 * 60 * 24));
                const hours = Math.floor((Math.abs(timeDifference) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((Math.abs(timeDifference) % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((Math.abs(timeDifference) % (1000 * 60)) / 1000);

                let countdownInfo = '';
                countdownInfo += `<div class="grand-block">`;
                countdownInfo += `<div class="haut">`;
                countdownInfo += `<div class="gauche">`;
                if (timeDifference <= 0 || (days === 0 && hours < 0)) {
                    // Vous êtes en retard (délai écoulé), changez la couleur en rouge
                    countdownInfo += `<div class="timer" style="color: red;"><p>Vous etes en retard de: </p>${days}j ${hours}h ${minutes}m ${seconds}s</div>`;
                } else if (days < 1 || (days === 1 && hours === 0 && minutes === 0 && seconds === 0)) {
                    // Changez la couleur en rouge si le délai est moins d'un jour ou exactement 0 jours
                    countdownInfo += `<div style="color: red;"><p>Il vous reste :</p>${days}j ${hours}h ${minutes}m ${seconds}s</div>`;
                } else {
                    countdownInfo += `Il vous reste: ${days}j ${hours}h ${minutes}m ${seconds}s `;
                }
                countdownInfo += `</div>`;
                

                countdownInfo += `<div class="droite">`;
                countdownInfo += `<p>Professeur : ${countdown.nomProfesseur} </p>`;
                countdownInfo += `</div>`;
                countdownInfo += `</div>`;
                
                countdownInfo += `<div class="UE">`;
                                // Associer la couleur à chaque valeur d'UE
                                switch (countdown.UE.toLowerCase()) {
                                    case 'développer':
                                        countdownInfo += `<span style="color: green;">${countdown.UE}</span> `;
                                        break;
                                    case 'comprendre':
                                        countdownInfo += `<span style="color: red;">${countdown.UE}</span> `;
                                        break;
                                    case 'exprimer':
                                        countdownInfo += `<span style="color: yellow;">${countdown.UE}</span>, `;
                                        break;
                                    case 'entreprendre':
                                        countdownInfo += `<span style="color: blue;">${countdown.UE}</span> `;
                                        break;
                                    case 'concevoir':
                                        countdownInfo += `<span style="color: orange;">${countdown.UE}</span> `;
                                        break;
                                    default:
                                        countdownInfo += `${countdown.UE}, `;
                                }
                countdownInfo += `</div>`;


                
                countdownInfo += `<p> ${countdown.descriptionDevoir} </p> `;

                
                countdownInfo += `<input type="checkbox" id="devoirFini_${index}" onchange="toggleDevoirFini(${index})">`;
                countdownInfo += `<label for="devoirFini_${index}">Devoir fini</label>`;

                countdownInfo += `<div class="bloc"><button onclick="signalerDevoir(${index})">Signaler</button>`;

                countdownInfo += `<button onclick="editCountdown(${index})">Modifier</button>`;
                countdownInfo += `<button class="btn" onclick="confirmDelete(${index})">Supprimer</button></div>`;
                countdownInfo += `</div>`;

                timerText += `<div id="timer_${index}" style="color: ${countdown.couleurUE};">${countdownInfo}</div>`;
            }
        });
    } else {
        console.error('Countdowns data is not an array:', countdowns);
    }

    const timersElement = document.getElementById('timers');
    if (timersElement) {
        timersElement.innerHTML = timerText;
    }

    timerInterval = setInterval(function () {
        updateTimers(countdowns);
    }, 1000);
}



function searchCountdowns() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();

    // Filtrez les countdowns pour ceux qui contiennent la valeur de recherche
    const filteredCountdowns = countdowns.filter(countdown => {
        return (
            countdown.nomProfesseur.toLowerCase().includes(searchValue) ||
            countdown.descriptionDevoir.toLowerCase().includes(searchValue) ||
            countdown.UE.toLowerCase().includes(searchValue)
        );
    });

    // Mettez à jour les timers avec les compteurs filtrés
    updateTimers(filteredCountdowns);
}

let currentIndex; 

function editCountdown(index) {
    // Récupérer les données du compte à rebours correspondant à l'index
    const countdownToEdit = countdowns[index];

    // Rediriger vers la page d'édition avec les paramètres dans l'URL
    const editUrl = `edit_countdown.php?index=${index}&targetDate=${countdownToEdit.targetDate}&matiere=${countdownToEdit.matiere}&nomProfesseur=${countdownToEdit.nomProfesseur}&descriptionDevoir=${countdownToEdit.descriptionDevoir}&UE=${countdownToEdit.UE}&couleurUE=${countdownToEdit.couleurUE}`;
    window.location.href = editUrl;
}



function confirmDelete(index) {
    const isConfirmed = window.confirm("Voulez-vous vraiment supprimer ce compte à rebours ?");
    if (isConfirmed) {
        // Appeler la fonction de suppression avec l'index
        deleteCountdown(index);
    }
}

function deleteCountdown(index) {
    // Utiliser une requête AJAX pour supprimer le minuteur du serveur
    fetch('delete_countdown.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            index,
        }),
    })
        .then(response => response.json())
        .then(countdowns => {
            updateTimers(countdowns);
        })
        .catch(error => console.error('Error deleting countdown:', error));
}


function updateCountdown(index) {
    // Récupérez les valeurs modifiées depuis le formulaire
    const editedTargetDate = new Date(document.getElementById('editTargetDate').value);
    const editedNomProfesseur = document.getElementById('editNomProfesseur').value;
    const editedDescriptionDevoir = document.getElementById('editDescriptionDevoir').value;
    const editedUE = document.getElementById('editUE').value;

    // Utilisez une requête AJAX pour mettre à jour le compteur sur le serveur
    fetch('update_countdown.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            index,
            targetDate: editedTargetDate.getTime(),
            nomProfesseur: editedNomProfesseur,
            descriptionDevoir: editedDescriptionDevoir,
            UE: editedUE,
        }),
    })
    .then(response => response.json())
    .then(updatedCountdowns => {
        // Mettez à jour la div timers avec les informations du compte à rebours modifié
        const updatedCountdown = updatedCountdowns[index];
        const timersElement = document.getElementById('timers');
        const timerDiv = timersElement.children[index];

        if (timerDiv) {
            // Mettez à jour le contenu de la div avec les nouvelles informations
            timerDiv.innerHTML = generateCountdownHTML(updatedCountdown);
        }

        // Redirigez vers la page d'accueil après la modification
        goToIndexPage();
    })
    .catch(error => console.error('Error updating countdown:', error));
}


function signalerDevoir(index) {
    window.alert("Vous avez signalé ce devoir.");
}

function toggleDevoirFini(index) {
    const checkbox = document.getElementById(`devoirFini_${index}`);
    
    if (checkbox.checked) {
        // Utiliser la boîte de dialogue de confirmation native
        const isConfirmed = window.confirm("Devoir terminé! Vous avez terminé ce devoir. Voulez-vous le supprimer?");
        
        if (isConfirmed) {
            // Supprimer le timer après la confirmation
            deleteCountdown(index);
        } else {
            // Désélectionner la case à cocher si l'utilisateur annule la suppression
            checkbox.checked = false;
        }
    }
}

function toggleSortOptions() {
    document.getElementById("sortOptions").classList.toggle("show");
  }
  
  window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  };

  function sortCountdowns(sortBy) {
    switch (sortBy) {
      case 'recent':
        countdowns.sort((a, b) => b.targetDate - a.targetDate);
        break;
      case 'ancient':
        countdowns.sort((a, b) => a.targetDate - b.targetDate);
        break;
      case 'ue':
        countdowns.sort((a, b) => a.UE.localeCompare(b.UE));
        break;
      case 'prof':
        countdowns.sort((a, b) => a.nomProfesseur.localeCompare(b.nomProfesseur));
        break;
      default:
        // Par défaut, triez par date récente
        countdowns.sort((a, b) => b.targetDate - a.targetDate);
    }
  
    // Mettez à jour les compteurs après le tri
    updateTimers(countdowns);
  }
  