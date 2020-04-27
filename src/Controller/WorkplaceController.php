<?php

namespace App\Controller;

use App\Entity\Equipment;
use App\Entity\User;
use App\Entity\Workplace;
use JMS\Serializer\SerializerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/app")
 */
class WorkplaceController extends AbstractController
{
    private $serializer;

    public function __construct(SerializerInterface $serializer)
    {
        $this->serializer = $serializer;
    }

    /**
     * @Route("/workplace/", name="workplace_list")
     * @Route("/workplace/add/", name="workplace_add")
     * @Route("/workplace/show/{id}/", name="workplace_show")
     * @Route("/workplace/edit/{id}/", name="workplace_edit")
     */
    public function index()
    {
        return $this->render('default/index.html.twig', [
            'header_title' => 'Miejsca pracy',
        ]);
    }

    /**
     * @Route("/api/get-workplace/{id}/", name="get_single_workplace_api")
     */
    public function getSingleWorkplace(Request $request, int $id)
    {
        if (!$request->isXmlHttpRequest()) {
            $this->createAccessDeniedException();
        }

        $workplace = $this->getDoctrine()->getRepository(Workplace::class)->find($id);
        $equipments = $this->getDoctrine()->getRepository(Equipment::class)->findAll();
        $equipmentTypes = [];
        foreach ($equipments as $equipment) {
            $equipmentTypes[$equipment->getType()][] = $equipment;
        }

        return new Response($this->serializer->serialize([
            'workplace' => $workplace,
            'equipment' => $equipmentTypes,
        ], 'json'));
    }

    /**
     * @Route("/api/get-workplace-list/")
     */
    public function getWorkplaceList(Request $request, PaginatorInterface $paginator)
    {
        if (!$request->isXmlHttpRequest()) {
            $this->createAccessDeniedException();
        }

        $workplaces = $paginator->paginate(
            $this->getDoctrine()->getRepository(Workplace::class)->findAllQuery(),
            $request->query->getInt('page', 1)
        );

        $isAddingAllowed = $this->isGranted(User::ADMIN);

        return new Response(
            $this->serializer->serialize(
                [
                    'workplaces' => $workplaces,
                    'isAddingAllowed' => $isAddingAllowed,
                ],
                'json'
            )
        );
    }

    /**
     * @Route("/api/create-workplace/")
     */
    public function AddWorkplace(Request $request)
    {
        $workplace = new Workplace();
        $workplace->setSignature($request->get('signature'))
            ->setDescription($request->get('description'))
        ;

        $equipments = $this->getDoctrine()->getRepository(Equipment::class)->findBy(['id' => $request->get('equipment')]);

        $em = $this->getDoctrine()->getManager();

        foreach ($equipments as $equipment) {
            $equipment->setWorkplace($workplace);
            $em->persist($equipment);
        }

        $em->persist($workplace);
        $em->flush();

        return new Response('OK');
    }

    /**
     * @Route("/api/edit-workplace/{id}/")
     */
    public function editWorkplace(Request $request, Workplace $workplace)
    {
        $workplace->setSignature($request->get('signature'))
            ->setDescription($request->get('description'))
        ;

        $addedEquipments = $workplace->getEquipments();
        $equipments = $this->getDoctrine()->getRepository(Equipment::class)->findBy(['id' => $request->get('equipment')]);

        $em = $this->getDoctrine()->getManager();

        $toRemove = $addedEquipments->filter(function (Equipment $equipment) use ($request) {
            return !in_array($equipment->getId(), $request->get('equipment'));
        });

        foreach ($toRemove as $equipmentToRemove) {
            $equipmentToRemove->setWorkplace(null);
            $em->persist($equipmentToRemove);
        }

        foreach ($equipments as $equipment) {
            $equipment->setWorkplace($workplace);
            $em->persist($equipment);
        }

        $em->persist($workplace);
        $em->flush();

        return new Response('OK');
    }
}
