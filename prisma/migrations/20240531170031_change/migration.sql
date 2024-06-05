-- DropForeignKey
ALTER TABLE "donationRequests" DROP CONSTRAINT "donationRequests_donorId_fkey";

-- DropForeignKey
ALTER TABLE "donationRequests" DROP CONSTRAINT "donationRequests_requesterId_fkey";

-- AlterTable
ALTER TABLE "donationRequests" ALTER COLUMN "donorId" DROP NOT NULL,
ALTER COLUMN "requesterId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "donationRequests" ADD CONSTRAINT "donationRequests_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donationRequests" ADD CONSTRAINT "donationRequests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
