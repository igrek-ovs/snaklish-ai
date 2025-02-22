import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLessonTables1740233581705 implements MigrationInterface {
    name = 'AddLessonTables1740233581705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`exercise_options\` (\`id\` int NOT NULL AUTO_INCREMENT, \`optionText\` varchar(255) NOT NULL, \`exerciseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`exercises\` (\`id\` int NOT NULL AUTO_INCREMENT, \`question\` varchar(255) NOT NULL, \`correctOptionId\` int NOT NULL, \`lessonId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`lessons\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`level\` enum ('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL, \`content\` varchar(255) NOT NULL, \`youtubeLink\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`lesson_progress\` (\`id\` int NOT NULL AUTO_INCREMENT, \`completed\` tinyint NOT NULL DEFAULT 0, \`completedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`lessonId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_answers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`isCorrect\` tinyint NOT NULL, \`answeredAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`exerciseId\` int NULL, \`selectedOptionId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`exercise_options\` ADD CONSTRAINT \`FK_4b43b7f2f773cc29f19d2be5a7b\` FOREIGN KEY (\`exerciseId\`) REFERENCES \`exercises\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`exercises\` ADD CONSTRAINT \`FK_c7a7b90ae6ce91a6d8bcf09b8b6\` FOREIGN KEY (\`lessonId\`) REFERENCES \`lessons\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lesson_progress\` ADD CONSTRAINT \`FK_eb4349e70765bb218bb4f833f68\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lesson_progress\` ADD CONSTRAINT \`FK_df13299d2740b302dd44a368df9\` FOREIGN KEY (\`lessonId\`) REFERENCES \`lessons\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_answers\` ADD CONSTRAINT \`FK_23984f136e23ff9a75e7c9c3c27\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_answers\` ADD CONSTRAINT \`FK_b191db203979421162dd15381e6\` FOREIGN KEY (\`exerciseId\`) REFERENCES \`exercises\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_answers\` ADD CONSTRAINT \`FK_1a2b8935ed33c55aea4821e59c4\` FOREIGN KEY (\`selectedOptionId\`) REFERENCES \`exercise_options\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_answers\` DROP FOREIGN KEY \`FK_1a2b8935ed33c55aea4821e59c4\``);
        await queryRunner.query(`ALTER TABLE \`user_answers\` DROP FOREIGN KEY \`FK_b191db203979421162dd15381e6\``);
        await queryRunner.query(`ALTER TABLE \`user_answers\` DROP FOREIGN KEY \`FK_23984f136e23ff9a75e7c9c3c27\``);
        await queryRunner.query(`ALTER TABLE \`lesson_progress\` DROP FOREIGN KEY \`FK_df13299d2740b302dd44a368df9\``);
        await queryRunner.query(`ALTER TABLE \`lesson_progress\` DROP FOREIGN KEY \`FK_eb4349e70765bb218bb4f833f68\``);
        await queryRunner.query(`ALTER TABLE \`exercises\` DROP FOREIGN KEY \`FK_c7a7b90ae6ce91a6d8bcf09b8b6\``);
        await queryRunner.query(`ALTER TABLE \`exercise_options\` DROP FOREIGN KEY \`FK_4b43b7f2f773cc29f19d2be5a7b\``);
        await queryRunner.query(`DROP TABLE \`user_answers\``);
        await queryRunner.query(`DROP TABLE \`lesson_progress\``);
        await queryRunner.query(`DROP TABLE \`lessons\``);
        await queryRunner.query(`DROP TABLE \`exercises\``);
        await queryRunner.query(`DROP TABLE \`exercise_options\``);
    }

}
