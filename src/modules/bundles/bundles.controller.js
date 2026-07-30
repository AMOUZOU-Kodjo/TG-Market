import * as bundlesService from './bundles.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';
import { notifyUser } from '../notifications/notifications.service.js';

export async function createBundle(req, res, next) {
  try {
    const { title, description, productIds, bundlePrice } = req.body;
    const sellerId = req.user.id;
    const bundle = await bundlesService.createBundle(sellerId, { title, description, productIds, bundlePrice });
    res.status(201).json(bundle);
  } catch (err) {
    next(err);
  }
}

export async function getMyBundles(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const result = await bundlesService.getMyBundles(req.user.id, { page, perPage });
    res.json({
      data: result.bundles,
      meta: buildPaginationMeta(result.total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function getPublicBundles(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const q = req.query.q || '';
    const result = await bundlesService.getPublicBundles({ page, perPage, q });
    res.json({
      data: result.bundles,
      meta: buildPaginationMeta(result.total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function getBundleById(req, res, next) {
  try {
    const bundle = await bundlesService.getBundleById(Number(req.params.id));
    res.json(bundle);
  } catch (err) {
    next(err);
  }
}

export async function purchaseBundle(req, res, next) {
  try {
    const bundleId = Number(req.params.id);
    const buyerId = req.user.id;
    const result = await bundlesService.purchaseBundle(bundleId, buyerId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateBundle(req, res, next) {
  try {
    const { title, description, bundlePrice } = req.body;
    const bundle = await bundlesService.updateBundle(
      Number(req.params.id),
      req.user.id,
      { title, description, bundlePrice },
    );
    res.json(bundle);
  } catch (err) {
    next(err);
  }
}

export async function deleteBundle(req, res, next) {
  try {
    const result = await bundlesService.deleteBundle(Number(req.params.id), req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function addProductToBundle(req, res, next) {
  try {
    const { productId } = req.body;
    const bundle = await bundlesService.addProductToBundle(
      Number(req.params.id),
      req.user.id,
      Number(productId),
    );
    res.json(bundle);
  } catch (err) {
    next(err);
  }
}

// ─── Bundle Proposals ────────────────────────────────────

export async function createBundleProposal(req, res, next) {
  try {
    const bundleId = Number(req.params.id);
    const { proposedPrice, message } = req.body;
    const buyerId = req.user.id;
    const proposal = await bundlesService.createBundleProposal(bundleId, buyerId, { proposedPrice, message });

    const io = req.app.get('io');
    if (io) {
      await notifyUser(io, proposal.sellerId, {
        type: 'bundle_proposal',
        title: 'Nouvelle proposition sur votre lot',
        description: `${req.user.firstName ?? ''} ${req.user.lastName ?? ''} a proposé ${proposedPrice?.toLocaleString('fr-FR')} FCFA`,
        metadata: { bundleId: proposal.bundleId },
      });
    }

    res.status(201).json(proposal);
  } catch (err) {
    next(err);
  }
}

export async function getBundleProposals(req, res, next) {
  try {
    const bundleId = Number(req.params.id);
    const proposals = await bundlesService.getBundleProposals(bundleId, req.user.id);
    res.json({ data: proposals });
  } catch (err) {
    next(err);
  }
}

export async function getMyBundleProposals(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const result = await bundlesService.getMyBundleProposals(req.user.id, { page, perPage });
    res.json({ data: result.data, meta: buildPaginationMeta(result.total, page, perPage) });
  } catch (err) {
    next(err);
  }
}

export async function getReceivedBundleProposals(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const result = await bundlesService.getReceivedBundleProposals(req.user.id, { page, perPage });
    res.json({ data: result.data, meta: buildPaginationMeta(result.total, page, perPage) });
  } catch (err) {
    next(err);
  }
}

export async function acceptBundleProposal(req, res, next) {
  try {
    const proposalId = Number(req.params.proposalId);
    const proposal = await bundlesService.acceptBundleProposal(proposalId, req.user.id);

    const io = req.app.get('io');
    if (io) {
      await notifyUser(io, proposal.buyerId, {
        type: 'bundle_proposal_accepted',
        title: 'Proposition acceptée',
        description: `Votre proposition sur "${proposal.bundle?.title ?? 'le lot'}" a été acceptée`,
        metadata: { bundleId: proposal.bundleId },
      });
    }

    res.json(proposal);
  } catch (err) {
    next(err);
  }
}

export async function rejectBundleProposal(req, res, next) {
  try {
    const proposalId = Number(req.params.proposalId);
    const proposal = await bundlesService.rejectBundleProposal(proposalId, req.user.id);

    const io = req.app.get('io');
    if (io) {
      await notifyUser(io, proposal.buyerId, {
        type: 'bundle_proposal_rejected',
        title: 'Proposition refusée',
        description: `Votre proposition sur "${proposal.bundle?.title ?? 'le lot'}" a été refusée`,
        metadata: { bundleId: proposal.bundleId },
      });
    }

    res.json(proposal);
  } catch (err) {
    next(err);
  }
}

export async function cancelBundleProposal(req, res, next) {
  try {
    const proposalId = Number(req.params.proposalId);
    const proposal = await bundlesService.cancelBundleProposal(proposalId, req.user.id);

    const io = req.app.get('io');
    if (io) {
      const recipientId = proposal.sellerId === req.user.id ? proposal.buyerId : proposal.sellerId;
      await notifyUser(io, recipientId, {
        type: 'bundle_proposal_cancelled',
        title: 'Proposition annulée',
        description: `La proposition sur "${proposal.bundle?.title ?? 'le lot'}" a été annulée`,
        metadata: { bundleId: proposal.bundleId },
      });
    }

    res.json(proposal);
  } catch (err) {
    next(err);
  }
}

export async function removeProductFromBundle(req, res, next) {
  try {
    const productId = req.params.productId || req.body.productId;
    const bundle = await bundlesService.removeProductFromBundle(
      Number(req.params.id),
      req.user.id,
      Number(productId),
    );
    res.json(bundle);
  } catch (err) {
    next(err);
  }
}