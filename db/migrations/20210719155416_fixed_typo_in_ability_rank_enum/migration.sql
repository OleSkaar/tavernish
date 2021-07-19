/*
  Warnings:

  - The values [MEDICORE] on the enum `AbilityRank` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AbilityRank_new" AS ENUM ('NO', 'PATHETIC', 'HORRIBLE', 'TERRIBLE', 'POOR', 'MEDIOCRE', 'AVERAGE', 'GOOD', 'GREAT', 'EXCELLENT', 'GODLIKE');
ALTER TABLE "Ability" ALTER COLUMN "ranking" TYPE "AbilityRank_new" USING ("ranking"::text::"AbilityRank_new");
ALTER TYPE "AbilityRank" RENAME TO "AbilityRank_old";
ALTER TYPE "AbilityRank_new" RENAME TO "AbilityRank";
DROP TYPE "AbilityRank_old";
COMMIT;
