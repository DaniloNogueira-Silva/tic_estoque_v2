/*
  Warnings:

  - Added the required column `id_budget_company` to the `Budget_product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Budget_product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "valueA" INTEGER NOT NULL,
    "valueB" INTEGER NOT NULL,
    "valueC" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "id_budget_company" INTEGER NOT NULL,
    "id_budget" INTEGER NOT NULL,
    CONSTRAINT "Budget_product_id_budget_company_fkey" FOREIGN KEY ("id_budget_company") REFERENCES "Budget_company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Budget_product_id_budget_fkey" FOREIGN KEY ("id_budget") REFERENCES "Budget" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Budget_product" ("description", "id", "id_budget", "quantity", "valueA", "valueB", "valueC") SELECT "description", "id", "id_budget", "quantity", "valueA", "valueB", "valueC" FROM "Budget_product";
DROP TABLE "Budget_product";
ALTER TABLE "new_Budget_product" RENAME TO "Budget_product";
CREATE UNIQUE INDEX "Budget_product_id_budget_company_key" ON "Budget_product"("id_budget_company");
CREATE UNIQUE INDEX "Budget_product_id_budget_key" ON "Budget_product"("id_budget");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
