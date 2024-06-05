/*
  Warnings:

  - You are about to drop the column `hospitalAddress` on the `donationRequests` table. All the data in the column will be lost.
  - You are about to drop the column `hospitalName` on the `donationRequests` table. All the data in the column will be lost.
  - Added the required column `bloodType` to the `donationRequests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "donationRequests" DROP COLUMN "hospitalAddress",
DROP COLUMN "hospitalName",
ADD COLUMN     "bloodType" "BloodType" NOT NULL;
