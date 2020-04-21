<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200421164203 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('CREATE TABLE equipment (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, workplace_id INTEGER DEFAULT NULL, type VARCHAR(127) NOT NULL, model VARCHAR(63) NOT NULL, signature VARCHAR(127) NOT NULL, buy_year INTEGER NOT NULL, value INTEGER NOT NULL, description CLOB DEFAULT NULL)');
        $this->addSql('CREATE INDEX IDX_D338D583AC25FB46 ON equipment (workplace_id)');
        $this->addSql('CREATE TABLE workplace (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, signature VARCHAR(255) NOT NULL, description CLOB DEFAULT NULL)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('DROP TABLE equipment');
        $this->addSql('DROP TABLE workplace');
    }
}
