import prisma from '../config/database.js';

export async function deleteUserData(userId) {
  await prisma.$transaction(
    async (tx) => {
      const products = await tx.product.findMany({
        where: { user_id: userId },
        select: { id: true },
      });
      const productIds = products.map((p) => p.id);

      const bundles = await tx.bundle.findMany({
        where: { seller_id: userId },
        select: { id: true },
      });
      const bundleIds = bundles.map((b) => b.id);

      const escrows = await tx.escrowTransaction.findMany({
        where: {
          OR: [
            { buyer_id: userId },
            { seller_id: userId },
            ...(productIds.length ? [{ product_id: { in: productIds } }] : []),
          ],
        },
        select: { id: true },
      });
      const escrowIds = escrows.map((e) => e.id);

      await tx.review.deleteMany({
        where: {
          OR: [
            { reviewer_id: userId },
            { seller_id: userId },
            ...(escrowIds.length ? [{ escrow_id: { in: escrowIds } }] : []),
          ],
        },
      });

      if (escrowIds.length) {
        await tx.escrowTransaction.deleteMany({ where: { id: { in: escrowIds } } });
      }

      await tx.offer.deleteMany({
        where: {
          OR: [
            { buyer_id: userId },
            { seller_id: userId },
            ...(productIds.length ? [{ product_id: { in: productIds } }] : []),
          ],
        },
      });

      await tx.bundleProposal.deleteMany({
        where: {
          OR: [
            { buyer_id: userId },
            { seller_id: userId },
            ...(bundleIds.length ? [{ bundle_id: { in: bundleIds } }] : []),
          ],
        },
      });

      if (productIds.length) {
        await tx.bundleItem.deleteMany({ where: { product_id: { in: productIds } } });
      }

      if (bundleIds.length) {
        await tx.bundle.deleteMany({ where: { id: { in: bundleIds } } });
      }

      await tx.report.deleteMany({
        where: {
          OR: [
            { reporter_id: userId },
            ...(productIds.length ? [{ product_id: { in: productIds } }] : []),
          ],
        },
      });

      if (productIds.length) {
        await tx.product.deleteMany({ where: { id: { in: productIds } } });
      }

      await tx.conversationParticipant.deleteMany({ where: { user_id: userId } });

      const orphanConversations = await tx.conversation.findMany({
        where: { participants: { none: {} } },
        select: { id: true },
      });

      if (orphanConversations.length) {
        await tx.conversation.deleteMany({
          where: { id: { in: orphanConversations.map((c) => c.id) } },
        });
      }

      await tx.user.delete({ where: { id: userId } });
    },
    { timeout: 60000 }
  );
}
