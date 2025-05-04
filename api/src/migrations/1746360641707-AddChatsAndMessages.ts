import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChatsAndMessages1746360641707 implements MigrationInterface {
    name = 'AddChatsAndMessages1746360641707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`messages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NULL, \`senderType\` enum ('USER', 'AI') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`chatId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chats\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`word_translations\` CHANGE \`language\` \`language\` enum ('FRENCH', 'UKRAINIAN', 'GERMAN') NULL`);
        await queryRunner.query(`ALTER TABLE \`words\` ADD CONSTRAINT \`FK_351b7e37a2124e2d26e4ce3eb2c\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_36bc604c820bb9adc4c75cd4115\` FOREIGN KEY (\`chatId\`) REFERENCES \`chats\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chats\` ADD CONSTRAINT \`FK_ae8951c0a763a060593606b7e2d\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chats\` DROP FOREIGN KEY \`FK_ae8951c0a763a060593606b7e2d\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_36bc604c820bb9adc4c75cd4115\``);
        await queryRunner.query(`ALTER TABLE \`words\` DROP FOREIGN KEY \`FK_351b7e37a2124e2d26e4ce3eb2c\``);
        await queryRunner.query(`ALTER TABLE \`word_translations\` CHANGE \`language\` \`language\` enum ('FRENCH', 'SPANISH', 'GERMAN') NULL`);
        await queryRunner.query(`DROP TABLE \`chats\``);
        await queryRunner.query(`DROP TABLE \`messages\``);
    }

}
