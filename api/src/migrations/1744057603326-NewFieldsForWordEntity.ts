import { MigrationInterface, QueryRunner } from "typeorm";

export class NewFieldsForWordEntity1744057603326 implements MigrationInterface {
    name = 'NewFieldsForWordEntity1744057603326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`words\` DROP COLUMN \`language\``);
        await queryRunner.query(`ALTER TABLE \`word_translations\` ADD \`language\` enum ('FRENCH', 'SPANISH', 'GERMAN') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`word_translations\` DROP COLUMN \`language\``);
        await queryRunner.query(`ALTER TABLE \`words\` ADD \`language\` enum ('ENGLISH', 'FRENCH', 'SPANISH', 'GERMAN', 'UKRAINIAN') NULL`);
    }

}
