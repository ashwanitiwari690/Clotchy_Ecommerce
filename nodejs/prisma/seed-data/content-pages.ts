import { PrismaClient } from "@prisma/client";

// Shared by prisma/seed.ts (full dev seed) and prisma/seed-content.ts (production-safe:
// only touches StaticPage/Faq, never the demo admin/user accounts or dummy catalog).
export async function seedStaticPages(prisma: PrismaClient) {
  const pages = [
    {
      slug: "help",
      title: "Help Center",
      content:
        "Need a hand? Browse our FAQs, send us a message from the Contact Us page, or email support@clothcy.com and our team will get back to you within 24 hours.",
    },
    {
      slug: "shipping-policy",
      title: "Shipping Policy",
      content:
        "We offer free shipping on all orders above ₹999. Orders are dispatched within 1-2 business days and delivered within 5-7 business days across India. You will receive a tracking link by email and SMS once your order ships.",
    },
    {
      slug: "return-policy",
      title: "Return Policy",
      content:
        "We offer easy 7-day returns on unused items in their original packaging. To start a return, contact our support team with your order number. Refunds are processed within 5-7 business days of us receiving the returned item.",
    },
    {
      slug: "bulk-orders",
      title: "Bulk Orders",
      content:
        "Planning a bulk order for your team, event or brand? We offer special pricing and custom designs on orders of 20+ pieces. Reach out via the Contact Us page with your quantity, sizes and design requirements, and our team will get back to you with a quote within 2 business days.",
    },
  ];

  for (const page of pages) {
    await prisma.staticPage.upsert({
      where: { slug: page.slug },
      update: {},
      create: { ...page, status: "active" },
    });
  }

  console.log(`Seeded ${pages.length} static pages.`);
}

export async function seedFaqs(prisma: PrismaClient) {
  const faqs = [
    {
      question: "How long does delivery take?",
      answer: "Orders are delivered within 5-7 business days across India after dispatch.",
      category: "Shipping",
    },
    {
      question: "What is your return policy?",
      answer: "We offer easy 7-day returns on unused items in their original packaging.",
      category: "Returns",
    },
    {
      question: "Which payment methods do you accept?",
      answer: "We accept UPI, credit/debit cards, net banking and cash on delivery.",
      category: "Payments",
    },
    {
      question: "How can I track my order?",
      answer: "Use the Track Order page with your order number and registered phone number, or check the tracking link sent to your email.",
      category: "Orders",
    },
  ];

  const existingCount = await prisma.faq.count();
  if (existingCount === 0) {
    await prisma.faq.createMany({
      data: faqs.map((f, i) => ({ ...f, displayOrder: i + 1, status: "active" })),
    });
  }

  console.log(`Seeded ${faqs.length} FAQs.`);
}
