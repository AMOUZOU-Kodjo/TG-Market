import 'dotenv/config';
import { getAllCategories, getCategoryProducts } from './src/modules/categories/categories.service.js';

const roots = await getAllCategories();
for (const r of roots) {
  const page = await getCategoryProducts(r.slug, { page: 1, perPage: 20 });
  const status = r.productCount === page.total ? 'OK' : `MISMATCH (page=${page.total})`;
  console.log(`${r.name}: compteur=${r.productCount} / page=${page.total} ${status}`);
}
process.exit(0);
