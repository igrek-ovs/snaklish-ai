import { MigrationInterface, QueryRunner } from "typeorm";

export class NewFieldsForWordEntity1744053932553 implements MigrationInterface {
    name = 'NewFieldsForWordEntity1744053932553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`word_translations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`translation\` varchar(255) NOT NULL, \`wordId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`words\` (\`id\` int NOT NULL AUTO_INCREMENT, \`level\` enum ('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL, \`word\` varchar(255) NOT NULL, \`language\` enum ('ENGLISH', 'FRENCH', 'SPANISH', 'GERMAN', 'UKRAINIAN') NULL, \`transcription\` varchar(255) NULL, \`examples\` text NULL, \`img\` blob NULL, UNIQUE INDEX \`IDX_38a98e41b6be0f379166dc2b58\` (\`word\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_words\` (\`id\` int NOT NULL AUTO_INCREMENT, \`isLearnt\` tinyint NOT NULL DEFAULT 0, \`userId\` varchar(36) NULL, \`wordId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`email_verifications\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(6) NOT NULL, \`isUsed\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`word_translations\` ADD CONSTRAINT \`FK_e9ef899c7a6de972fb22364e7a5\` FOREIGN KEY (\`wordId\`) REFERENCES \`words\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_words\` ADD CONSTRAINT \`FK_00b5d2a73200f7059d3b4576cfc\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_words\` ADD CONSTRAINT \`FK_f7f1412e64794db16bb12b6dff8\` FOREIGN KEY (\`wordId\`) REFERENCES \`words\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`email_verifications\` ADD CONSTRAINT \`FK_4e63a91e0a684b31496bd50733e\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`email_verifications\` DROP FOREIGN KEY \`FK_4e63a91e0a684b31496bd50733e\``);
        await queryRunner.query(`ALTER TABLE \`user_words\` DROP FOREIGN KEY \`FK_f7f1412e64794db16bb12b6dff8\``);
        await queryRunner.query(`ALTER TABLE \`user_words\` DROP FOREIGN KEY \`FK_00b5d2a73200f7059d3b4576cfc\``);
        await queryRunner.query(`ALTER TABLE \`word_translations\` DROP FOREIGN KEY \`FK_e9ef899c7a6de972fb22364e7a5\``);
        await queryRunner.query(`DROP TABLE \`email_verifications\``);
        await queryRunner.query(`DROP TABLE \`user_words\``);
        await queryRunner.query(`DROP INDEX \`IDX_38a98e41b6be0f379166dc2b58\` ON \`words\``);
        await queryRunner.query(`DROP TABLE \`words\``);
        await queryRunner.query(`DROP TABLE \`word_translations\``);
    }

}
