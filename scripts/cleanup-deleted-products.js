// import 'dotenv/config';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('Recherche des produits avec status="deleted"...');

//   const deletedProducts = await prisma.product.findMany({
//     where: { status: 'deleted' },
//     select: { id: true, title: true, category_id: true },
//   });

//   if (deletedProducts.length === 0) {
//     console.log('Aucun produit soft-deleté trouvé. Rien à nettoyer.');
//     return;
//   }

//   console.log(`${deletedProducts.length} produit(s) soft-deleté(s) trouvé(s).`);

//   const productIds = deletedProducts.map((p) => p.id);

//   const escrowCount = await prisma.escrowTransaction.count({
//     where: { product_id: { in: productIds } },
//   });
//   console.log(`${escrowCount} escrow(s) lié(s) à supprimer.`);

//   await prisma.$transaction(async (tx) => {
//     await tx.escrowTransaction.deleteMany({
//       where: { product_id: { in: productIds } },
//     });

//     const result = await tx.product.deleteMany({
//       where: { id: { in: productIds } },
//     });

//     console.log(`${result.count} produit(s) supprimé(s) de la base.`);
//   });

//   console.log('Nettoyage terminé !');
// }

// main()
//   .catch((e) => {
//     console.error('Erreur :', e);
//     process.exit(1);
//   })
//   .finally(() => prisma.$disconnect());
