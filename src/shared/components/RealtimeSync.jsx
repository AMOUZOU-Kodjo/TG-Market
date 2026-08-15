import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/shared/contexts/SocketContext";
import { useAuth } from "@/shared/contexts/AuthContext";

export function RealtimeSync() {
  const { on, connected } = useSocket();
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  useEffect(() => {
    if (!connected) return;

    const unsubs = [];

    // Products
    unsubs.push(on("product_viewed", ({ productId }) => {
      if (productId) queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }));

    unsubs.push(on("product_created", () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({ queryKey: ["adminActivity"] });
    }));

    unsubs.push(on("product_updated", ({ product }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", product?.id] });
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({ queryKey: ["adminActivity"] });
    }));

    unsubs.push(on("product_deleted", ({ productId }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (productId) queryClient.removeQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({ queryKey: ["adminActivity"] });
    }));

    // Escrow
    unsubs.push(on("escrow_created", () => {
      queryClient.invalidateQueries({ queryKey: ["escrow"] });
      queryClient.invalidateQueries({ queryKey: ["adminEscrow"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({ queryKey: ["adminActivity"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    }));

    unsubs.push(on("escrow_updated", ({ escrow }) => {
      queryClient.invalidateQueries({ queryKey: ["escrow"] });
      if (escrow?.id) queryClient.invalidateQueries({ queryKey: ["escrow", escrow.id] });
      queryClient.invalidateQueries({ queryKey: ["adminEscrow"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({ queryKey: ["adminActivity"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    }));

    // Favorites
    unsubs.push(on("favorite_toggled", ({ productId }) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    }));

    unsubs.push(on("favorite_removed", ({ productId }) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    }));

    // Users
    unsubs.push(on("user_updated", ({ userId }) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["seller", userId] });
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminActivity"] });
    }));

    unsubs.push(on("user_followed", ({ followingId }) => {
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["seller", followingId] });
    }));

    unsubs.push(on("user_unfollowed", ({ followingId }) => {
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["seller", followingId] });
    }));

    unsubs.push(on("user_deleted", () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminActivity"] });
    }));

    // Messages (liste des conversations + badge)
    unsubs.push(on("new_message", () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }));

    unsubs.push(on("message_notification", () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      refreshUser();
    }));

    // Wallet
    unsubs.push(on("wallet_updated", () => {
      queryClient.invalidateQueries({ queryKey: ["walletBalance"] });
      queryClient.invalidateQueries({ queryKey: ["walletTransactions"] });
    }));

    unsubs.push(on("payment_methods_updated", () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    }));

    // Bundles
    unsubs.push(on("bundle_created", () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
      queryClient.invalidateQueries({ queryKey: ["myBundles"] });
    }));

    unsubs.push(on("bundle_updated", ({ bundle }) => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
      queryClient.invalidateQueries({ queryKey: ["bundle", bundle?.id] });
      queryClient.invalidateQueries({ queryKey: ["myBundles"] });
    }));

    unsubs.push(on("bundle_deleted", ({ bundleId }) => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
      if (bundleId) queryClient.removeQueries({ queryKey: ["bundle", bundleId] });
      queryClient.invalidateQueries({ queryKey: ["myBundles"] });
    }));

    unsubs.push(on("bundle_purchased", () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
      queryClient.invalidateQueries({ queryKey: ["myBundles"] });
      queryClient.invalidateQueries({ queryKey: ["walletBalance"] });
      queryClient.invalidateQueries({ queryKey: ["walletTransactions"] });
    }));

    // Bundle proposals
    unsubs.push(on("bundle_proposal_created", ({ bundleId }) => {
      queryClient.invalidateQueries({ queryKey: ["bundleProposals"] });
      queryClient.invalidateQueries({ queryKey: ["receivedBundleProposals"] });
      queryClient.invalidateQueries({ queryKey: ["myBundleProposals"] });
      if (bundleId) queryClient.invalidateQueries({ queryKey: ["bundle", bundleId] });
    }));

    unsubs.push(on("bundle_proposal_updated", ({ bundleId }) => {
      queryClient.invalidateQueries({ queryKey: ["bundleProposals"] });
      queryClient.invalidateQueries({ queryKey: ["receivedBundleProposals"] });
      queryClient.invalidateQueries({ queryKey: ["myBundleProposals"] });
      if (bundleId) queryClient.invalidateQueries({ queryKey: ["bundle", bundleId] });
    }));

    // Categories
    unsubs.push(on("categories_updated", () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }));

    // Offers
    unsubs.push(on("offer_created", () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }));

    unsubs.push(on("offer_updated", ({ offerId }) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offer", offerId] });
    }));

    // Reviews
    unsubs.push(on("review_created", ({ review }) => {
      queryClient.invalidateQueries({ queryKey: ["productReviews"] });
      queryClient.invalidateQueries({ queryKey: ["sellerReviews"] });
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
      queryClient.invalidateQueries({ queryKey: ["seller", review?.sellerId] });
    }));

    // KYC
    unsubs.push(on("kyc_submitted", () => {
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
      queryClient.invalidateQueries({ queryKey: ["kycStatus"] });
      queryClient.invalidateQueries({ queryKey: ["kycBadges"] });
    }));

    unsubs.push(on("kyc_updated", () => {
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
      queryClient.invalidateQueries({ queryKey: ["adminKyc"] });
      queryClient.invalidateQueries({ queryKey: ["kycStatus"] });
      queryClient.invalidateQueries({ queryKey: ["kycBadges"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({ queryKey: ["adminKycPendingCount"] });
      queryClient.invalidateQueries({ queryKey: ["seller"] });
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
    }));

    // Settings
    unsubs.push(on("settings_changed", () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    }));

    // Reports
    unsubs.push(on("report_created", () => {
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
      queryClient.invalidateQueries({ queryKey: ["adminReportsCount"] });
    }));

    unsubs.push(on("report_updated", () => {
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
      queryClient.invalidateQueries({ queryKey: ["adminReportsCount"] });
    }));

    // Contact messages (admin)
    unsubs.push(on("contact_message_created", () => {
      queryClient.invalidateQueries({ queryKey: ["adminUnreadMessages"] });
      queryClient.invalidateQueries({ queryKey: ["adminContactMessages"] });
    }));

    return () => {
      unsubs.forEach((fn) => fn?.());
    };
  }, [connected, on, queryClient, refreshUser]);

  return null;
}
