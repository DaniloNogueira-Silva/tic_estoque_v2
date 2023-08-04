/*
  Warnings:

  - You are about to drop the `Budget_Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Budget_Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order_Items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Budget_Company";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Budget_Product";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Order_Items";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Order_items" (
    "id_order" INTEGER NOT NULL,
    "id_product" INTEGER NOT NULL,
    "quantity_in_stock" INTEGER NOT NULL,
    "new_quantity" INTEGER NOT NULL,

    PRIMARY KEY ("id_order", "id_product"),
    CONSTRAINT "Order_items_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_items_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Budget_company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "corporate_name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "id_budget" INTEGER NOT NULL,
    CONSTRAINT "Budget_company_id_budget_fkey" FOREIGN KEY ("id_budget") REFERENCES "Budget" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Budget_product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "valueA" INTEGER NOT NULL,
    "valueB" INTEGER NOT NULL,
    "valueC" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "id_budget" INTEGER NOT NULL,
    CONSTRAINT "Budget_product_id_budget_fkey" FOREIGN KEY ("id_budget") REFERENCES "Budget" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Budget_company_id_budget_key" ON "Budget_company"("id_budget");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_product_id_budget_key" ON "Budget_product"("id_budget");
