<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{
    private $userPasswordEncoder;

    public function __construct(UserPasswordEncoderInterface $userPasswordEncoder)
    {
        $this->userPasswordEncoder = $userPasswordEncoder;
    }

    public function load(ObjectManager $manager)
    {
        $user = new User();
        $user
            ->setEmail('admin@mail.com')
            ->setFirstName('Admin')
            ->setLastName('Admin')
            ->setPhone('555-555-555')
            ->setRoles([$user::ADMIN])
        ;

        $user->setPassword($this->userPasswordEncoder->encodePassword(
            $user,
            'admin'
        ));
        $manager->persist($user);
        $manager->flush();
    }
}
