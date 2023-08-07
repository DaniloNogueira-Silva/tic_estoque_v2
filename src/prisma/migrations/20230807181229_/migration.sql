/*
  Warnings:

  - You are about to drop the column `id_order` on the `Order_item` table. All the data in the column will be lost.
  - You are about to drop the column `id_product` on the `Order_item` table. All the data in the column will be lost.
  - You are about to drop the column `new_quantity` on the `Order_item` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_in_stock` on the `Order_item` table. All the data in the column will be lost.
  - You are about to drop the column `id_category` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `id_unit_measure` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `origin_city_hall` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Budget_product` table. All the data in the column will be lost.
  - You are about to drop the column `id_budget` on the `Budget_product` table. All the data in the column will be lost.
  - You are about to drop the column `id_budget_company` on the `Budget_product` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Budget_product` table. All the data in the column will be lost.
  - You are about to drop the column `valueA` on the `Budget_product` table. All the data in the column will be lost.
  - You are about to drop the column `valueB` on the `Budget_product` table. All the data in the column will be lost.
  - You are about to drop the column `valueC` on the `Budget_product` table. All the data in the column will be lost.
  - You are about to drop the column `is_admin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `corporate_name` on the `Budget_company` table. All the data in the column will be lost.
  - You are about to drop the column `id_budget` on the `Budget_company` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Budget_company` table. All the data in the column will be lost.
  - Added the required column `newQuantity` to the `Order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `Order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityInStock` to the `Order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `measureId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originCityHall` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budgetId` to the `Budget_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budget_companyId` to the `Budget_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `Budget_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unidade` to the `Budget_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorA` to the `Budget_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorB` to the `Budget_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorC` to the `Budget_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAdmin` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budgetId` to the `Budget_company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `razao_social` to the `Budget_company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `Budget_company` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order_item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "expected_date" DATETIME NOT NULL,
    "quantityInStock" INTEGER NOT NULL,
    "newQuantity" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "Order_item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order_item" ("expected_date", "id", "status") SELECT "expected_date", "id", "status" FROM "Order_item";
DROP TABLE "Order_item";
ALTER TABLE "new_Order_item" RENAME TO "Order_item";
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "purchase_allowed" BOOLEAN NOT NULL,
    "originCityHall" BOOLEAN NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "measureId" INTEGER NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_measureId_fkey" FOREIGN KEY ("measureId") REFERENCES "Unit_Measure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("id", "location", "name", "purchase_allowed", "quantity") SELECT "id", "location", "name", "purchase_allowed", "quantity" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_Budget_product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "valorA" INTEGER NOT NULL,
    "valorB" INTEGER NOT NULL,
    "valorC" INTEGER NOT NULL,
    "unidade" INTEGER NOT NULL,
    "budget_companyId" INTEGER NOT NULL,
    "budgetId" INTEGER NOT NULL,
    CONSTRAINT "Budget_product_budget_companyId_fkey" FOREIGN KEY ("budget_companyId") REFERENCES "Budget_company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Budget_product_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Budget_product" ("id") SELECT "id" FROM "Budget_product";
DROP TABLE "Budget_product";
ALTER TABLE "new_Budget_product" RENAME TO "Budget_product";
CREATE UNIQUE INDEX "Budget_product_budget_companyId_key" ON "Budget_product"("budget_companyId");
CREATE UNIQUE INDEX "Budget_product_budgetId_key" ON "Budget_product"("budgetId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "token" TEXT,
    "expiresIn" DATETIME,
    "used" BOOLEAN
);
INSERT INTO "new_User" ("email", "expiresIn", "id", "name", "password", "token", "used") SELECT "email", "expiresIn", "id", "name", "password", "token", "used" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Budget_company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "razao_social" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "budgetId" INTEGER NOT NULL,
    CONSTRAINT "Budget_company_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Budget_company" ("cnpj", "id") SELECT "cnpj", "id" FROM "Budget_company";
DROP TABLE "Budget_company";
ALTER TABLE "new_Budget_company" RENAME TO "Budget_company";
CREATE UNIQUE INDEX "Budget_company_budgetId_key" ON "Budget_company"("budgetId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
