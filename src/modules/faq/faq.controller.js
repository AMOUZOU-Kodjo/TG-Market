import * as faqService from './faq.service.js';

export async function getAllFaqs(req, res, next) {
  try {
    const { category } = req.query;
    const faqs = await faqService.getAllFaqs(category || null);
    res.json({ data: faqs });
  } catch (err) {
    next(err);
  }
}
