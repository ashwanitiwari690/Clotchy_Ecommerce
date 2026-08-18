import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Dev-only seed: creates the one admin account (there's no way to create one
// through the public API - registration always assigns role=USER) plus a
// handful of demo catalog rows so the dashboard and storefront aren't empty
// while wiring up each phase.
const ADMIN_PHONE = "9999999999";
const ADMIN_PASSWORD = "Admin@12345";

async function seedAdmin() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const admin = await prisma.user.upsert({
    where: { phone: ADMIN_PHONE },
    update: { role: "ADMIN" },
    create: {
      name: "Clotchcy Admin",
      phone: ADMIN_PHONE,
      email: "admin@clotchcy.test",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`Admin ready -> phone: ${admin.phone}, password: ${ADMIN_PASSWORD}`);
}

async function seedCatalog() {
  const categories = await Promise.all(
    [
      { name: "T-Shirts", slug: "t-shirts", sortOrder: 1, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80" },
      { name: "Hoodies", slug: "hoodies", sortOrder: 2, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80" },
      { name: "Cargo Pants", slug: "cargo-pants", sortOrder: 3, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80" },
      { name: "Jackets", slug: "jackets", sortOrder: 4, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80" },
    ].map((c) => prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c })),
  );

  const collections = await Promise.all(
    [
      { name: "Wanderlust", slug: "wanderlust", featured: true, description: "EXPLORE MORE", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85" },
      { name: "Warrior", slug: "warrior", featured: true, description: "BOLD & FEARLESS", image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85" },
    ].map((c) => prisma.collection.upsert({ where: { slug: c.slug }, update: {}, create: c })),
  );

  const [tshirts, hoodies, cargo, jackets] = categories;
  const [wanderlust, warrior] = collections;

  const products = [
    {
      name: "Indian Army Brave Tee",
      slug: "indian-army-brave-tee",
      sku: "CLT-TSH-001",
      shortDescription: "Premium cotton tee with a bold warrior-inspired graphic.",
      description: "Premium cotton tee with a bold warrior-inspired front graphic. Soft, durable and made for everyday confidence.",
      price: 849,
      stock: 60,
      mainImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
      thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80",
      tags: ["bestseller", "cotton"],
      status: "published",
      featured: true,
      bestSeller: true,
      categoryId: tshirts.id,
      collectionIds: [warrior.id],
    },
    {
      name: "Wanderlust Oversized Tee",
      slug: "wanderlust-oversized-tee",
      sku: "CLT-TSH-002",
      shortDescription: "Relaxed oversized silhouette for travel days.",
      description: "Relaxed oversized silhouette for travel days, city walks and weekend plans.",
      price: 659,
      stock: 45,
      mainImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=85",
      thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80",
      tags: ["trending"],
      status: "published",
      featured: false,
      bestSeller: true,
      categoryId: tshirts.id,
      collectionIds: [wanderlust.id],
    },
    {
      name: "Om Spiritual Hoodie",
      slug: "om-spiritual-hoodie",
      sku: "CLT-HD-001",
      shortDescription: "Heavyweight comfort hoodie, minimal spiritual statement.",
      description: "Heavyweight comfort hoodie with a minimal spiritual-inspired statement.",
      price: 1199,
      stock: 30,
      mainImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",
      thumbnail: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=300&q=80",
      tags: [],
      status: "published",
      featured: true,
      bestSeller: false,
      categoryId: hoodies.id,
      collectionIds: [],
    },
    {
      name: "Urban Cargo Utility Pants",
      slug: "urban-cargo-utility-pants",
      sku: "CLT-CRG-001",
      shortDescription: "Utility-inspired cargo pants with practical pockets.",
      description: "Utility-inspired cargo pants with practical pockets and a modern tapered fit.",
      price: 1499,
      stock: 25,
      mainImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85",
      thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
      tags: ["new"],
      status: "published",
      featured: false,
      bestSeller: false,
      categoryId: cargo.id,
      collectionIds: [warrior.id],
    },
    {
      name: "Street Utility Jacket",
      slug: "street-utility-jacket",
      sku: "CLT-JKT-001",
      shortDescription: "Layer-ready utility jacket, streetwear styling.",
      description: "Layer-ready utility jacket combining clean streetwear styling with everyday function.",
      price: 1899,
      salePrice: 1599,
      stock: 15,
      mainImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85",
      thumbnail: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=300&q=80",
      tags: ["sale"],
      status: "published",
      featured: false,
      bestSeller: true,
      categoryId: jackets.id,
      collectionIds: [wanderlust.id],
    },
    {
      name: "Draft Prototype Tee",
      slug: "draft-prototype-tee",
      sku: "CLT-TSH-099",
      shortDescription: "Unreleased design, still in review.",
      description: "Unreleased design, still in review.",
      price: 799,
      stock: 0,
      mainImage: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=85",
      thumbnail: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=300&q=80",
      tags: [],
      status: "draft",
      featured: false,
      bestSeller: false,
      categoryId: tshirts.id,
      collectionIds: [],
    },
  ];

  for (const { collectionIds, ...data } of products) {
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        collections: collectionIds.length > 0 ? { connect: collectionIds.map((id) => ({ id })) } : undefined,
        variants: {
          create: [
            { size: "M", sku: `${data.sku}-M`, price: data.price, stock: 10 },
            { size: "L", sku: `${data.sku}-L`, price: data.price, stock: 10 },
          ],
        },
      },
    });
  }

  console.log(`Seeded ${categories.length} categories, ${collections.length} collections, ${products.length} products.`);
}

async function seedHomeManagement() {
  const hero = await prisma.heroBanner.findFirst({ where: { heading: "LEGENDARY LOOKS. FOR EVERY LEGEND." } });
  if (!hero) {
    await prisma.heroBanner.create({
      data: {
        heading: "LEGENDARY LOOKS. FOR EVERY LEGEND.",
        subheading: "PREMIUM APPAREL - BUILT FOR BOLD LIVING",
        description: "Premium apparel inspired by courage, culture & individuality.",
        desktopImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=85",
        primaryButtonText: "SHOP NOW",
        primaryButtonLink: "/products",
        secondaryButtonText: "NEW ARRIVALS",
        secondaryButtonLink: "/products?sort=new",
        status: "active",
        displayOrder: 1,
      },
    });
  }

  const [tshirts, hoodies] = await Promise.all([
    prisma.category.findUnique({ where: { slug: "t-shirts" } }),
    prisma.category.findUnique({ where: { slug: "hoodies" } }),
  ]);
  for (const [i, category] of [tshirts, hoodies].entries()) {
    if (!category) continue;
    await prisma.homeCategoryFeature.upsert({
      where: { categoryId: category.id },
      update: {},
      create: { categoryId: category.id, displayOrder: i + 1, status: "active" },
    });
  }

  const [wanderlust, warrior] = await Promise.all([
    prisma.collection.findUnique({ where: { slug: "wanderlust" } }),
    prisma.collection.findUnique({ where: { slug: "warrior" } }),
  ]);
  for (const [i, collection] of [wanderlust, warrior].entries()) {
    if (!collection) continue;
    await prisma.homeCollectionFeature.upsert({
      where: { collectionId: collection.id },
      update: {},
      create: {
        collectionId: collection.id,
        shortDescription: collection.description ?? "",
        link: `/products?collection=${collection.slug}`,
        displayOrder: i + 1,
        status: "active",
      },
    });
  }

  const bestSellerSlugs = ["indian-army-brave-tee", "wanderlust-oversized-tee", "street-utility-jacket"];
  const bestSellerProducts = await prisma.product.findMany({ where: { slug: { in: bestSellerSlugs } } });
  for (const [i, product] of bestSellerProducts.entries()) {
    await prisma.bestSellerFeature.upsert({
      where: { productId: product.id },
      update: {},
      create: { productId: product.id, displayOrder: i + 1, status: "active" },
    });
  }

  const communityImages = [
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=500&q=80",
  ];
  const existingCommunityCount = await prisma.communityImage.count();
  if (existingCommunityCount === 0) {
    await prisma.communityImage.createMany({
      data: communityImages.map((image, i) => ({ image, displayOrder: i + 1, status: "active" })),
    });
  }

  console.log("Seeded home management: hero banner, featured categories/collections/best-sellers, community images.");
}

async function main() {
  await seedAdmin();
  await seedCatalog();
  await seedHomeManagement();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
