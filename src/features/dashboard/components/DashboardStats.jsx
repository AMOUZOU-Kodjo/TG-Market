import { Package, Eye, DollarSign, MessageCircle } from "lucide-react";
import StatCard from "@/shared/ui/StatCard";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useMyProducts } from "@/features/products/hooks/useProducts";
import { useWalletBalance } from "@/features/wallet/hooks/useWallet";
import { formatCFA } from "@/shared/utils/format";

export default function DashboardStats() {
  const { user } = useAuth();
  const { data: myProductsData, isLoading: loadingProducts } = useMyProducts();
  const { data: walletData, isLoading: loadingWallet } = useWalletBalance();

  const totalProducts = myProductsData?.meta?.total ?? 0;
  const totalViews =
    myProductsData?.data?.reduce((sum, p) => sum + (p.views || 0), 0) ?? 0;
  const totalEarned = walletData?.totalEarned ?? 0;
  const unreadMessages = user?.unreadMessages ?? 0;

  const stats = [
    {
      icon: Package,
      value: loadingProducts ? "..." : totalProducts.toLocaleString("fr-FR"),
      label: "Total annonces",
    },
    {
      icon: Eye,
      value: loadingProducts ? "..." : totalViews.toLocaleString("fr-FR"),
      label: "Vues totales",
    },
    {
      icon: DollarSign,
      value: loadingWallet ? "..." : formatCFA(totalEarned),
      label: "Revenus (FCFA)",
    },
    {
      icon: MessageCircle,
      value: unreadMessages,
      label: "Messages non lus",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
