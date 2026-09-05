import { PrismaClient } from "@prisma/client";
import { seedStaticPages, seedFaqs } from "./seed-data/content-pages";

// Production-safe seed: only upserts StaticPage/Faq rows (idempotent, additive).
// Unlike seed.ts, it never touches the demo admin/user accounts or dummy catalog data,
// so it's safe to run against a live database - e.g. after deploying this feature,
// run once with DATABASE_URL pointed at the production database:
//   DATABASE_URL="<production connection string>" npx tsx prisma/seed-content.ts
const prisma = new PrismaClient();

async function main() {
  await seedStaticPages(prisma);
  await seedFaqs(prisma);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
