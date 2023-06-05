/*
  Warnings:

  - Added the required column `resetPinExpiresAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `resetPin` VARCHAR(191) NULL,
    ADD COLUMN `resetPinExpiresAt` DATETIME(3) NOT NULL;
