<?php

namespace App\Controller;

use App\Entity\Equipment;
use App\Entity\User;
use JMS\Serializer\SerializerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/app")
 */
class EquipmentController extends AbstractController
{
    /**
     * @Route("/equipment/", name="equipment_list")
     * @Route("/equipment/add/", name="equipment_add")
     */
    public function index()
    {
        return $this->render('default/index.html.twig', [
            'header_title' => 'Wyposażenie',
        ]);
    }

    /**
     * @Route("/api/get-equipment-list/")
     */
    public function getEquipmentList(Request $request, PaginatorInterface $paginator, SerializerInterface $serializer)
    {
        if (!$request->isXmlHttpRequest()) {
            $this->createAccessDeniedException();
        }

        if (!$this->isGranted(User::ADMIN)) {
            return new Response('Nie masz uprawnień', Response::HTTP_FORBIDDEN);
        }

        $equipments = $paginator->paginate(
            $this->getDoctrine()->getRepository(Equipment::class)->findAllQuery(),
            $request->query->getInt('page', 1),
        );

        return new Response($serializer->serialize($equipments, 'json'));
    }

    /**
     * @Route("/api/get-grouped-equipment/")
     */
    public function getEquipmentListGroupedByType(Request $request, SerializerInterface $serializer)
    {
        if (!$request->isXmlHttpRequest()) {
            $this->createAccessDeniedException();
        }

        $equipments = $this->getDoctrine()->getRepository(Equipment::class)->findAll();
        $equipmentTypes = [];
        foreach ($equipments as $equipment) {
            $equipmentTypes[$equipment->getType()][] = $equipment;
        }

        return new Response($serializer->serialize($equipmentTypes, 'json'));
    }

    /**
     * @Route("/api/create-equipment/")
     */
    public function AddEquipment(Request $request)
    {
        if (!$request->isXmlHttpRequest()) {
            $this->createAccessDeniedException();
        }

        $equipment = new Equipment();
        $equipment->setType($request->get('type'))
            ->setModel($request->get('model'))
            ->setSignature($request->get('signature'))
            ->setBuyYear($request->get('buyYear'))
            ->setValue($request->get('value'))
            ->setDescription($request->get('description'))
        ;

        try {
            $em = $this->getDoctrine()->getManager();
            $em->persist($equipment);
            $em->flush();

            return new Response('Element wyposażenia został pomyślnie dodany');
        } catch (\Exception $e) {
            return new Response('Wystąpił błąd. Spróbuj ponownie', Response::HTTP_BAD_REQUEST);
        }
    }
}
