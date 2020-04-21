<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200421170904 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles CLOB NOT NULL --(DC2Type:json)
        , password VARCHAR(255) NOT NULL, first_name VARCHAR(63) NOT NULL, last_name VARCHAR(127) NOT NULL, phone VARCHAR(31) NOT NULL, description VARCHAR(255) DEFAULT NULL)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON user (email)');
        $this->addSql('DROP INDEX IDX_D338D583AC25FB46');
        $this->addSql('CREATE TEMPORARY TABLE __temp__equipment AS SELECT id, workplace_id, type, model, signature, buy_year, value, description FROM equipment');
        $this->addSql('DROP TABLE equipment');
        $this->addSql('CREATE TABLE equipment (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, workplace_id INTEGER DEFAULT NULL, type VARCHAR(127) NOT NULL COLLATE BINARY, model VARCHAR(63) NOT NULL COLLATE BINARY, signature VARCHAR(127) NOT NULL COLLATE BINARY, buy_year INTEGER NOT NULL, value INTEGER NOT NULL, description CLOB DEFAULT NULL COLLATE BINARY, CONSTRAINT FK_D338D583AC25FB46 FOREIGN KEY (workplace_id) REFERENCES workplace (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO equipment (id, workplace_id, type, model, signature, buy_year, value, description) SELECT id, workplace_id, type, model, signature, buy_year, value, description FROM __temp__equipment');
        $this->addSql('DROP TABLE __temp__equipment');
        $this->addSql('CREATE INDEX IDX_D338D583AC25FB46 ON equipment (workplace_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('DROP TABLE user');
        $this->addSql('DROP INDEX IDX_D338D583AC25FB46');
        $this->addSql('CREATE TEMPORARY TABLE __temp__equipment AS SELECT id, workplace_id, type, model, signature, buy_year, value, description FROM equipment');
        $this->addSql('DROP TABLE equipment');
        $this->addSql('CREATE TABLE equipment (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, workplace_id INTEGER DEFAULT NULL, type VARCHAR(127) NOT NULL, model VARCHAR(63) NOT NULL, signature VARCHAR(127) NOT NULL, buy_year INTEGER NOT NULL, value INTEGER NOT NULL, description CLOB DEFAULT NULL)');
        $this->addSql('INSERT INTO equipment (id, workplace_id, type, model, signature, buy_year, value, description) SELECT id, workplace_id, type, model, signature, buy_year, value, description FROM __temp__equipment');
        $this->addSql('DROP TABLE __temp__equipment');
        $this->addSql('CREATE INDEX IDX_D338D583AC25FB46 ON equipment (workplace_id)');
    }
}
