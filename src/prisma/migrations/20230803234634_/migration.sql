/*
  Warnings:

  - You are about to drop the `Order_items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Order_items";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Order_item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "expected_date" DATETIME NOT NULL,
    "quantity_in_stock" INTEGER NOT NULL,
    "new_quantity" INTEGER NOT NULL,
    "id_order" INTEGER NOT NULL,
    "id_product" INTEGER NOT NULL,
    CONSTRAINT "Order_item_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_item_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
