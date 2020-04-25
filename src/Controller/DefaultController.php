<?php

namespace App\Controller;

use App\Entity\ModuleLink;
use App\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

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

    /**
     * @Route("/app/api/get-dashboard-links/")
     */
    public function getDashboardLinks(Request $request, SerializerInterface $serializer)
    {
        $links = new ArrayCollection();
        $links->add(
            (new ModuleLink())
                ->setTitle('Rezerwacje')
                ->setIcon('access_time')
                ->setUrl('#')
                ->setRole(User::USER)
        );
        $links->add(
            (new ModuleLink())
                ->setTitle('Miejsca pracy')
                ->setIcon('apps')
                ->setUrl('#')
                ->setRole(User::USER)
        );
        $links->add(
            (new ModuleLink())
                ->setTitle('Wyposażenie')
                ->setIcon('devices')
                ->setUrl($this->generateUrl('equipment_list'))
                ->setRole(User::ADMIN)
        );
        $links->add(
            (new ModuleLink())
                ->setTitle('Pacownicy')
                ->setIcon('supervisor_account')
                ->setUrl($this->generateUrl('user_list'))
                ->setRole(User::ADMIN)
        );
        $userRoles = $this->getUser()->getRoles();

        return new Response(
            $serializer->serialize(
                $links->filter(function (ModuleLink $moduleLink) use ($userRoles) {
                    return in_array($moduleLink->getRole(), $userRoles);
                }),
                'json'
            )
        );
    }
}
