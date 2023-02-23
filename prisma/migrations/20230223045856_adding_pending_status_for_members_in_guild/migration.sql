-- CreateTable
CREATE TABLE "_Pending" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Pending_AB_unique" ON "_Pending"("A", "B");

-- CreateIndex
CREATE INDEX "_Pending_B_index" ON "_Pending"("B");

-- AddForeignKey
ALTER TABLE "_Pending" ADD CONSTRAINT "_Pending_A_fkey" FOREIGN KEY ("A") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Pending" ADD CONSTRAINT "_Pending_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
