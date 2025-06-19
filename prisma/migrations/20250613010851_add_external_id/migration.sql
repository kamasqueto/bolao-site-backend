/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `game` ADD COLUMN `externalId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Game_externalId_key` ON `Game`(`externalId`);
