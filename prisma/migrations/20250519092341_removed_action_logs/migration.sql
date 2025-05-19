/*
  Warnings:

  - You are about to drop the column `actionLogId` on the `EcoAction` table. All the data in the column will be lost.
  - You are about to drop the `ActionLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EcoAction" DROP CONSTRAINT "EcoAction_actionLogId_fkey";

-- AlterTable
ALTER TABLE "EcoAction" DROP COLUMN "actionLogId";

-- DropTable
DROP TABLE "ActionLog";
