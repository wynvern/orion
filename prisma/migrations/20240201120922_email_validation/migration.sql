-- AlterTable
ALTER TABLE `comment` MODIFY `content` VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false;
