/*
  Warnings:

  - Made the column `resetPin` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `resetPin` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` ENUM('USER', 'ADMIN', 'SUPPORT') NOT NULL,
    `read` BOOLEAN NOT NULL,
    `create` BOOLEAN NOT NULL,
    `update` BOOLEAN NOT NULL,
    `delete` BOOLEAN NOT NULL,

    UNIQUE INDEX `Permission_role_key`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
