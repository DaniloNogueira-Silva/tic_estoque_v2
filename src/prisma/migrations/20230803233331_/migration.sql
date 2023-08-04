/*
  Warnings:

  - You are about to drop the column `expected_date` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.
  - The primary key for the `Order_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `expected_date` to the `Order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Order_items` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);
INSERT INTO "new_Order" ("id") SELECT "id" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_Order_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "expected_date" DATETIME NOT NULL,
    "quantity_in_stock" INTEGER NOT NULL,
    "new_quantity" INTEGER NOT NULL,
    "id_order" INTEGER NOT NULL,
    "id_product" INTEGER NOT NULL,
    CONSTRAINT "Order_items_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_items_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order_items" ("id_order", "id_product", "new_quantity", "quantity_in_stock") SELECT "id_order", "id_product", "new_quantity", "quantity_in_stock" FROM "Order_items";
DROP TABLE "Order_items";
ALTER TABLE "new_Order_items" RENAME TO "Order_items";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
