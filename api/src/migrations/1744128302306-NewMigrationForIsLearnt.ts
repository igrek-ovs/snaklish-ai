import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigrationForIsLearnt1744128302306 implements MigrationInterface {
    name = 'NewMigrationForIsLearnt1744128302306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_words\` DROP FOREIGN KEY \`FK_f7f1412e64794db16bb12b6dff8\``);
        await queryRunner.query(`ALTER TABLE \`user_words\` CHANGE \`wordId\` \`translationId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user_words\` ADD CONSTRAINT \`FK_5129f83d5962ab1984e6a92805e\` FOREIGN KEY (\`translationId\`) REFERENCES \`word_translations\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_words\` DROP FOREIGN KEY \`FK_5129f83d5962ab1984e6a92805e\``);
        await queryRunner.query(`ALTER TABLE \`user_words\` CHANGE \`translationId\` \`wordId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user_words\` ADD CONSTRAINT \`FK_f7f1412e64794db16bb12b6dff8\` FOREIGN KEY (\`wordId\`) REFERENCES \`words\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
