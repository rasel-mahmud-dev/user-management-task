-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('USER', 'ADMIN', 'SUPPORT') NOT NULL DEFAULT 'USER';
