/*
  Warnings:

  - A unique constraint covering the columns `[name,server]` on the table `Guild` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Guild_name_server_key" ON "Guild"("name", "server");
