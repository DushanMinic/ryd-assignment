import { MigrationInterface, QueryRunner } from "typeorm";

export class initialMigration1610198657708 implements MigrationInterface {
    name = 'initialMigration1610198657708'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "issues_status_enum" AS ENUM('unresolved', 'resolved', 'processing')`);
        await queryRunner.query(`CREATE TABLE "issues" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "description" character varying(500) NOT NULL, "status" "issues_status_enum" NOT NULL DEFAULT 'unresolved', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_9d8ecbbeff46229c700f0449257" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "supportAgents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(30) NOT NULL, "lastName" character varying(30) NOT NULL, "available" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_0f5767bd252092e101f1e926157" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "assignedIssues" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "supportAgentId" uuid NOT NULL, "issueId" uuid NOT NULL, CONSTRAINT "REL_099682300b1d1b21c65fd60eee" UNIQUE ("issueId"), CONSTRAINT "REL_1c22e5746555aeb4509558893e" UNIQUE ("supportAgentId"), CONSTRAINT "PK_eaca8bcf1170681d37eecf2a17c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "assignedIssues" ADD CONSTRAINT "FK_099682300b1d1b21c65fd60eee4" FOREIGN KEY ("issueId") REFERENCES "issues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assignedIssues" ADD CONSTRAINT "FK_1c22e5746555aeb4509558893ec" FOREIGN KEY ("supportAgentId") REFERENCES "supportAgents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignedIssues" DROP CONSTRAINT "FK_1c22e5746555aeb4509558893ec"`);
        await queryRunner.query(`ALTER TABLE "assignedIssues" DROP CONSTRAINT "FK_099682300b1d1b21c65fd60eee4"`);
        await queryRunner.query(`DROP TABLE "assignedIssues"`);
        await queryRunner.query(`DROP TABLE "supportAgents"`);
        await queryRunner.query(`DROP TABLE "issues"`);
        await queryRunner.query(`DROP TYPE "issues_status_enum"`);
    }

}
