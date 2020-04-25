<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/app")
 */
class UserController extends AbstractController
{
    private $serializer;

    public function __construct(SerializerInterface $serializer)
    {
        $this->serializer = $serializer;
    }

    /**
     * @Route("/user/", name="user_list")
     * @Route("/user/show/{id}/", name="single_user_show")
     * @Route("/user/add/", name="add_user_view")
     */
    public function index(Request $request)
    {
        return $this->render('default/index.html.twig', [
            'view_block_name' => 'user_list',
            'header_title' => 'Pracownicy',
        ]);
    }

    /**
     * @Route("/api/get-user/{id}/", name="get_single_user_api")
     */
    public function getSingleUser(Request $request, int $id)
    {
        if (!$request->isXmlHttpRequest()) {
            $this->createAccessDeniedException();
        }

        if (!$this->isGranted(User::ADMIN)) {
            return new Response('Nie masz uprawnień!', Response::HTTP_FORBIDDEN);
        }

        $user = $this->getDoctrine()->getRepository(User::class)->find($id);

        return new Response($this->serializer->serialize($user, 'json'));
    }

    /**
     * @Route("/api/get-user-list/", name="get_user_api")
     */
    public function getUsers(Request $request)
    {
        if (!$request->isXmlHttpRequest()) {
            $this->createAccessDeniedException();
        }

        if (!$this->isGranted(User::ADMIN)) {
            return new Response('Nie masz uprawnień!', Response::HTTP_FORBIDDEN);
        }

        $users = $this->getDoctrine()->getRepository(User::class)->findAllExceptAdmin();

        return new Response($this->serializer->serialize($users, 'json'));
    }

    /**
     * @Route("/api/create-user/", name="create_user")
     */
    public function createUser(Request $request, UserPasswordEncoderInterface $passwordEncoder)
    {
        if (!$request->isXmlHttpRequest()) {
            $this->createAccessDeniedException();
        }

        $user = new User();
        $user->setFirstName($request->get('firstName'))
            ->setLastName($request->get('lastName'))
            ->setEmail($request->get('email'))
            ->setPhone($request->get('phone'))
            ->setDescription($request->get('description'))
            ->setRoles([User::USER])
        ;

        $user->setPassword($passwordEncoder->encodePassword(
            $user,
            $request->get('password')
        ));

        try {
            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();

            return new Response('Użytkownik został pomyślnie dodany');
        } catch (\Exception $e) {
            return new Response('Użytkownik o danym adresie email już istnieje', Response::HTTP_BAD_REQUEST);
        }
    }
}
