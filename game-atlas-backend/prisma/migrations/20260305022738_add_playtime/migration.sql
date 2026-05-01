/*
  Warnings:

  - The primary key for the `userlibrary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `userlibrary` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `userlibrary` DROP FOREIGN KEY `UserLibrary_gameId_fkey`;

-- DropForeignKey
ALTER TABLE `userlibrary` DROP FOREIGN KEY `UserLibrary_userId_fkey`;

-- DropIndex
DROP INDEX `UserLibrary_userId_gameId_key` ON `userlibrary`;

-- AlterTable
ALTER TABLE `userlibrary` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`userId`, `gameId`);

-- AddForeignKey
ALTER TABLE `UserLibrary` ADD CONSTRAINT `UserLibrary_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLibrary` ADD CONSTRAINT `UserLibrary_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
