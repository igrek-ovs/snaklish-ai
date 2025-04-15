import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoriesToWord1744735830507 implements MigrationInterface {
    name = 'AddCategoriesToWord1744735830507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`img\` blob NULL, UNIQUE INDEX \`IDX_8b0be371d28245da6e4f4b6187\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`words\` ADD \`categoryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`word_translations\` CHANGE \`language\` \`language\` enum ('FRENCH', 'UKRAINIAN', 'GERMAN') NULL`);
        await queryRunner.query(`ALTER TABLE \`words\` ADD CONSTRAINT \`FK_351b7e37a2124e2d26e4ce3eb2c\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`words\` DROP FOREIGN KEY \`FK_351b7e37a2124e2d26e4ce3eb2c\``);
        await queryRunner.query(`ALTER TABLE \`word_translations\` CHANGE \`language\` \`language\` enum ('FRENCH', 'SPANISH', 'GERMAN') NULL`);
        await queryRunner.query(`ALTER TABLE \`words\` DROP COLUMN \`categoryId\``);
        await queryRunner.query(`DROP INDEX \`IDX_8b0be371d28245da6e4f4b6187\` ON \`categories\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
    }

}
