import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoriesToWord1746296807799 implements MigrationInterface {
    name = 'AddCategoriesToWord1746296807799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`exercise_options\` (\`id\` int NOT NULL AUTO_INCREMENT, \`optionText\` varchar(255) NOT NULL, \`exerciseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`exercises\` (\`id\` int NOT NULL AUTO_INCREMENT, \`question\` varchar(255) NOT NULL, \`correctOptionId\` int NOT NULL, \`lessonId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`lessons\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`level\` enum ('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL, \`content\` varchar(255) NOT NULL, \`youtubeLink\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`lesson_progress\` (\`id\` int NOT NULL AUTO_INCREMENT, \`completed\` tinyint NOT NULL DEFAULT 0, \`completedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`lessonId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_answers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`isCorrect\` tinyint NOT NULL, \`answeredAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`exerciseId\` int NULL, \`selectedOptionId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`img\` blob NULL, UNIQUE INDEX \`IDX_8b0be371d28245da6e4f4b6187\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`words\` (\`id\` int NOT NULL AUTO_INCREMENT, \`level\` enum ('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL, \`word\` varchar(255) NOT NULL, \`transcription\` varchar(255) NULL, \`examples\` text NULL, \`img\` blob NULL, \`categoryId\` int NULL, UNIQUE INDEX \`IDX_38a98e41b6be0f379166dc2b58\` (\`word\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`word_translations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`translation\` varchar(255) NOT NULL, \`language\` enum ('FRENCH', 'UKRAINIAN', 'GERMAN') NULL, \`wordId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_words\` (\`id\` int NOT NULL AUTO_INCREMENT, \`isLearnt\` tinyint NOT NULL DEFAULT 0, \`userId\` varchar(36) NULL, \`translationId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`email\` varchar(150) NOT NULL, \`passwordHash\` varchar(255) NOT NULL, \`isEmailConfirmed\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user', UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`refresh_tokens\` (\`id\` varchar(36) NOT NULL, \`token\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`expiresAt\` datetime NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`email_verifications\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(6) NOT NULL, \`isUsed\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`exercise_options\` ADD CONSTRAINT \`FK_4b43b7f2f773cc29f19d2be5a7b\` FOREIGN KEY (\`exerciseId\`) REFERENCES \`exercises\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`exercises\` ADD CONSTRAINT \`FK_c7a7b90ae6ce91a6d8bcf09b8b6\` FOREIGN KEY (\`lessonId\`) REFERENCES \`lessons\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lesson_progress\` ADD CONSTRAINT \`FK_eb4349e70765bb218bb4f833f68\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lesson_progress\` ADD CONSTRAINT \`FK_df13299d2740b302dd44a368df9\` FOREIGN KEY (\`lessonId\`) REFERENCES \`lessons\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_answers\` ADD CONSTRAINT \`FK_23984f136e23ff9a75e7c9c3c27\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_answers\` ADD CONSTRAINT \`FK_b191db203979421162dd15381e6\` FOREIGN KEY (\`exerciseId\`) REFERENCES \`exercises\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_answers\` ADD CONSTRAINT \`FK_1a2b8935ed33c55aea4821e59c4\` FOREIGN KEY (\`selectedOptionId\`) REFERENCES \`exercise_options\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`words\` ADD CONSTRAINT \`FK_351b7e37a2124e2d26e4ce3eb2c\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`word_translations\` ADD CONSTRAINT \`FK_e9ef899c7a6de972fb22364e7a5\` FOREIGN KEY (\`wordId\`) REFERENCES \`words\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_words\` ADD CONSTRAINT \`FK_00b5d2a73200f7059d3b4576cfc\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_words\` ADD CONSTRAINT \`FK_5129f83d5962ab1984e6a92805e\` FOREIGN KEY (\`translationId\`) REFERENCES \`word_translations\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` ADD CONSTRAINT \`FK_610102b60fea1455310ccd299de\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`email_verifications\` ADD CONSTRAINT \`FK_4e63a91e0a684b31496bd50733e\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`email_verifications\` DROP FOREIGN KEY \`FK_4e63a91e0a684b31496bd50733e\``);
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` DROP FOREIGN KEY \`FK_610102b60fea1455310ccd299de\``);
        await queryRunner.query(`ALTER TABLE \`user_words\` DROP FOREIGN KEY \`FK_5129f83d5962ab1984e6a92805e\``);
        await queryRunner.query(`ALTER TABLE \`user_words\` DROP FOREIGN KEY \`FK_00b5d2a73200f7059d3b4576cfc\``);
        await queryRunner.query(`ALTER TABLE \`word_translations\` DROP FOREIGN KEY \`FK_e9ef899c7a6de972fb22364e7a5\``);
        await queryRunner.query(`ALTER TABLE \`words\` DROP FOREIGN KEY \`FK_351b7e37a2124e2d26e4ce3eb2c\``);
        await queryRunner.query(`ALTER TABLE \`user_answers\` DROP FOREIGN KEY \`FK_1a2b8935ed33c55aea4821e59c4\``);
        await queryRunner.query(`ALTER TABLE \`user_answers\` DROP FOREIGN KEY \`FK_b191db203979421162dd15381e6\``);
        await queryRunner.query(`ALTER TABLE \`user_answers\` DROP FOREIGN KEY \`FK_23984f136e23ff9a75e7c9c3c27\``);
        await queryRunner.query(`ALTER TABLE \`lesson_progress\` DROP FOREIGN KEY \`FK_df13299d2740b302dd44a368df9\``);
        await queryRunner.query(`ALTER TABLE \`lesson_progress\` DROP FOREIGN KEY \`FK_eb4349e70765bb218bb4f833f68\``);
        await queryRunner.query(`ALTER TABLE \`exercises\` DROP FOREIGN KEY \`FK_c7a7b90ae6ce91a6d8bcf09b8b6\``);
        await queryRunner.query(`ALTER TABLE \`exercise_options\` DROP FOREIGN KEY \`FK_4b43b7f2f773cc29f19d2be5a7b\``);
        await queryRunner.query(`DROP TABLE \`email_verifications\``);
        await queryRunner.query(`DROP TABLE \`refresh_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`user_words\``);
        await queryRunner.query(`DROP TABLE \`word_translations\``);
        await queryRunner.query(`DROP INDEX \`IDX_38a98e41b6be0f379166dc2b58\` ON \`words\``);
        await queryRunner.query(`DROP TABLE \`words\``);
        await queryRunner.query(`DROP INDEX \`IDX_8b0be371d28245da6e4f4b6187\` ON \`categories\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP TABLE \`user_answers\``);
        await queryRunner.query(`DROP TABLE \`lesson_progress\``);
        await queryRunner.query(`DROP TABLE \`lessons\``);
        await queryRunner.query(`DROP TABLE \`exercises\``);
        await queryRunner.query(`DROP TABLE \`exercise_options\``);
    }

}
