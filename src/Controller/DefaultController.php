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
     * @Route("/app", name="main_view")
     */
    public function index()
    {
        return $this->render('default/index.html.twig', [
            'controller_name' => 'DefaultController',
        ]);
    }
}
