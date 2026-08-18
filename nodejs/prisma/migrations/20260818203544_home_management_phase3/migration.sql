-- CreateTable
CREATE TABLE "hero_banners" (
    "id" TEXT NOT NULL,
    "desktopImage" TEXT,
    "mobileImage" TEXT,
    "heading" TEXT NOT NULL,
    "subheading" TEXT,
    "description" TEXT,
    "primaryButtonText" TEXT,
    "primaryButtonLink" TEXT,
    "secondaryButtonText" TEXT,
    "secondaryButtonLink" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_category_features" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "home_category_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_collection_features" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "shortDescription" TEXT,
    "link" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "home_collection_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "best_seller_features" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "best_seller_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_images" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "socialUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "home_category_features_categoryId_key" ON "home_category_features"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "home_collection_features_collectionId_key" ON "home_collection_features"("collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "best_seller_features_productId_key" ON "best_seller_features"("productId");

-- AddForeignKey
ALTER TABLE "home_category_features" ADD CONSTRAINT "home_category_features_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "home_collection_features" ADD CONSTRAINT "home_collection_features_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "best_seller_features" ADD CONSTRAINT "best_seller_features_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

