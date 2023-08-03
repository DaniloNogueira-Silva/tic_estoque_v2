/*
  Warnings:

  - You are about to drop the column `budgetId` on the `Budget_Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_budget]` on the table `Budget_Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_budget` to the `Budget_Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Budget_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "valueA" INTEGER NOT NULL,
    "valueB" INTEGER NOT NULL,
    "valueC" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "id_budget" INTEGER NOT NULL,
    CONSTRAINT "Budget_Product_id_budget_fkey" FOREIGN KEY ("id_budget") REFERENCES "Budget" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Budget_Product" ("description", "id", "quantity", "valueA", "valueB", "valueC") SELECT "description", "id", "quantity", "valueA", "valueB", "valueC" FROM "Budget_Product";
DROP TABLE "Budget_Product";
ALTER TABLE "new_Budget_Product" RENAME TO "Budget_Product";
CREATE UNIQUE INDEX "Budget_Product_id_budget_key" ON "Budget_Product"("id_budget");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Budget_Company_id_budget_key" ON "Budget_Company"("id_budget");
