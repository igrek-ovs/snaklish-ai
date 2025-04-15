import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigrationForIsLearnt1744138299951 implements MigrationInterface {
    name = 'NewMigrationForIsLearnt1744138299951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_words\` DROP FOREIGN KEY \`FK_f7f1412e64794db16bb12b6dff8\``);
        await queryRunner.query(`ALTER TABLE \`user_words\` CHANGE \`wordId\` \`translationId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`words\` DROP COLUMN \`language\``);
        await queryRunner.query(`ALTER TABLE \`word_translations\` ADD \`language\` enum ('FRENCH', 'SPANISH', 'GERMAN') NULL`);
        await queryRunner.query(`ALTER TABLE \`user_words\` ADD CONSTRAINT \`FK_5129f83d5962ab1984e6a92805e\` FOREIGN KEY (\`translationId\`) REFERENCES \`word_translations\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_words\` DROP FOREIGN KEY \`FK_5129f83d5962ab1984e6a92805e\``);
        await queryRunner.query(`ALTER TABLE \`word_translations\` DROP COLUMN \`language\``);
        await queryRunner.query(`ALTER TABLE \`words\` ADD \`language\` enum ('ENGLISH', 'FRENCH', 'SPANISH', 'GERMAN') NULL`);
        await queryRunner.query(`ALTER TABLE \`user_words\` CHANGE \`translationId\` \`wordId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user_words\` ADD CONSTRAINT \`FK_f7f1412e64794db16bb12b6dff8\` FOREIGN KEY (\`wordId\`) REFERENCES \`words\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
