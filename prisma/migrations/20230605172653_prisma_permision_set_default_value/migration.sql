-- AlterTable
ALTER TABLE `permission` MODIFY `read` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `create` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `update` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `delete` BOOLEAN NOT NULL DEFAULT false;
