/*
  Warnings:

  - You are about to drop the column `gameSessionId` on the `Character` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_gameSessionId_fkey";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "gameSessionId";

-- CreateTable
CREATE TABLE "_CharacterToGameSession" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CharacterToGameSession_AB_unique" ON "_CharacterToGameSession"("A", "B");

-- CreateIndex
CREATE INDEX "_CharacterToGameSession_B_index" ON "_CharacterToGameSession"("B");

-- AddForeignKey
ALTER TABLE "_CharacterToGameSession" ADD FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToGameSession" ADD FOREIGN KEY ("B") REFERENCES "GameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
