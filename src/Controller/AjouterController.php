<?php

// /var/www/sae301_/src/Controller/AjouterController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AjouterController extends AbstractController
{
    #[Route('/ajouter', name: 'app_ajouter')]

    public function index(): Response
    {
        return $this->render('ajouter/index.html.twig', [
            'controller_name' => 'AjouterController',
        ]);
    }
}
