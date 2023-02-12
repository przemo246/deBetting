-- DropForeignKey
ALTER TABLE "Bet" DROP CONSTRAINT "Bet_teamId_fkey";

-- AlterTable
ALTER TABLE "Bet" ALTER COLUMN "teamId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
