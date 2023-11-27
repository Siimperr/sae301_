<?php

// /var/www/sae301_/src/Controller/DevoirsController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DevoirsController extends AbstractController
{

     #[Route('/devoirs', name: 'app_devoirs')]

    public function index(): Response
    {
        return $this->render('devoirs/index.html.twig', [
            'controller_name' => 'DevoirsController',
        ]);
    }
}
