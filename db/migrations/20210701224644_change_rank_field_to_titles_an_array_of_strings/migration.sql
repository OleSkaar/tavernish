/*
  Warnings:

  - You are about to drop the column `rank` on the `Character` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Character" DROP COLUMN "rank",
ADD COLUMN     "titles" TEXT[];
