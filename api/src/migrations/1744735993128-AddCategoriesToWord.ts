import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoriesToWord1744735993128 implements MigrationInterface {
    name = 'AddCategoriesToWord1744735993128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_words\` DROP FOREIGN KEY \`FK_f7f1412e64794db16bb12b6dff8\``);
        await queryRunner.query(`ALTER TABLE \`user_words\` CHANGE \`wordId\` \`translationId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`word_translations\` CHANGE \`language\` \`language\` enum ('FRENCH', 'UKRAINIAN', 'GERMAN') NULL`);
        await queryRunner.query(`ALTER TABLE \`words\` ADD CONSTRAINT \`FK_351b7e37a2124e2d26e4ce3eb2c\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_words\` ADD CONSTRAINT \`FK_5129f83d5962ab1984e6a92805e\` FOREIGN KEY (\`translationId\`) REFERENCES \`word_translations\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_words\` DROP FOREIGN KEY \`FK_5129f83d5962ab1984e6a92805e\``);
        await queryRunner.query(`ALTER TABLE \`words\` DROP FOREIGN KEY \`FK_351b7e37a2124e2d26e4ce3eb2c\``);
        await queryRunner.query(`ALTER TABLE \`word_translations\` CHANGE \`language\` \`language\` enum ('FRENCH', 'SPANISH', 'GERMAN') NULL`);
        await queryRunner.query(`ALTER TABLE \`user_words\` CHANGE \`translationId\` \`wordId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user_words\` ADD CONSTRAINT \`FK_f7f1412e64794db16bb12b6dff8\` FOREIGN KEY (\`wordId\`) REFERENCES \`words\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
