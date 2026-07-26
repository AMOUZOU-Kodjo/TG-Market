import prisma from '../../config/database.js';

export async function getAllFaqs(category) {
  const where = { is_active: true };

  if (category) {
    where.category = category;
  }

  const faqs = await prisma.faq.findMany({
    where,
    select: {
      id: true,
      question: true,
      answer: true,
      category: true,
      sort_order: true,
    },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
  });

  return faqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    sortOrder: faq.sort_order,
  }));
}
