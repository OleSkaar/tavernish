-- CreateTable
CREATE TABLE "Ability" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "ranking" "AbilityRank" NOT NULL,
    "isBioAbility" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);
