import { MigrationInterface, QueryRunner } from "typeorm";

export class seedSupportAgents1610198749728 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        INSERT INTO "supportAgents"(id, "firstName", "lastName", "createdAt", "updatedAt")
        VALUES 
            (uuid_generate_v4(), 'Nikola', 'Tesla', now(), now()),
            (uuid_generate_v4(), 'Mihajlo', 'Pupin', now(), now()),
            (uuid_generate_v4(), 'Jeff', 'Bezos', now(), now());
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "supportAgents"`);
    }

}
