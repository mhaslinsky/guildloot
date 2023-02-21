/*
  Warnings:

  - Made the column `server` on table `Guild` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Guild" ALTER COLUMN "server" SET NOT NULL;
