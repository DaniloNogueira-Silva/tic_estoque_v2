-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "token" TEXT,
    "expiresIn" DATETIME,
    "used" BOOLEAN
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
    "originCityHall" BOOLEAN NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "measureId" INTEGER NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_measureId_fkey" FOREIGN KEY ("measureId") REFERENCES "Unit_Measure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "Order_item" (
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

-- CreateTable
CREATE TABLE "Budget" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "responsible_name" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "cpf" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Budget_company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "razao_social" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "budgetId" INTEGER NOT NULL,
    CONSTRAINT "Budget_company_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Budget_product" (
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

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_company_budgetId_key" ON "Budget_company"("budgetId");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_product_budget_companyId_key" ON "Budget_product"("budget_companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_product_budgetId_key" ON "Budget_product"("budgetId");
