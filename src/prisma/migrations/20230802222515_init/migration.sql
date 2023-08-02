-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL,
    "token" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Unit_Measure" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "unit_measure" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "purchase_allowed" BOOLEAN NOT NULL,
    "origin_city_hall" BOOLEAN NOT NULL,
    "id_category" INTEGER NOT NULL,
    "id_unit_measure" INTEGER NOT NULL,
    CONSTRAINT "Product_id_category_fkey" FOREIGN KEY ("id_category") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_id_unit_measure_fkey" FOREIGN KEY ("id_unit_measure") REFERENCES "Unit_Measure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "expected_date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Order_Items" (
    "id_order" INTEGER NOT NULL,
    "id_product" INTEGER NOT NULL,
    "quantity_in_stock" INTEGER NOT NULL,
    "new_quantity" INTEGER NOT NULL,

    PRIMARY KEY ("id_order", "id_product"),
    CONSTRAINT "Order_Items_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_Items_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "responsible_name" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "cpf" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Budget_Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "corporate_name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "id_budget" INTEGER NOT NULL,
    CONSTRAINT "Budget_Company_id_budget_fkey" FOREIGN KEY ("id_budget") REFERENCES "Budget" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Budget_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "valueA" INTEGER NOT NULL,
    "valueB" INTEGER NOT NULL,
    "valueC" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "budgetId" INTEGER,
    CONSTRAINT "Budget_Product_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
