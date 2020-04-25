<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    /**
     * @Route("/", name="homepage")
     */
    public function homepage()
    {
        if (!is_null($this->getUser())) {
            return $this->redirectToRoute('main_view');
        }

        return $this->redirectToRoute('app_login');
    }

    /**
     * @Route("/app/", name="main_view")
     */
    public function index()
    {
        $user = $this->getUser();
        $description = "Witaj, <strong>{$user->getFirstName()} {$user->getLastName()}</strong>. Poniżej znajdują się dostępne dla Ciebie widoki.";

        return $this->render('default/index.html.twig', [
            'header_title' => 'Witaj w systemie rezerwacji miejsc pracy',
            'view_block_name' => 'app_dashboard',
        ]);
    }
}
