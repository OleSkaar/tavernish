-- AlterTable
CREATE SEQUENCE "gamesession_number_seq";
ALTER TABLE "GameSession" ALTER COLUMN "number" SET DEFAULT nextval('gamesession_number_seq');
ALTER SEQUENCE "gamesession_number_seq" OWNED BY "GameSession"."number";
