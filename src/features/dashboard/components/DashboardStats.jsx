import { Package, Eye, DollarSign, MessageCircle } from "lucide-react";
import StatCard from "@/shared/ui/StatCard";

const stats = [
  {
    icon: Package,
    value: "47",
    label: "Total annonces",
    trend: 12,
    trendLabel: "vs. mois dernier",
  },
  {
    icon: Eye,
    value: "3 456",
    label: "Vues ce mois",
    trend: 8,
    trendLabel: "vs. mois dernier",
  },
  {
    icon: DollarSign,
    value: "1 250 000",
    label: "Revenus (FCFA)",
    trend: 23,
    trendLabel: "vs. mois dernier",
  },
  {
    icon: MessageCircle,
    value: "5",
    label: "Messages non lus",
    trend: -15,
    trendLabel: "vs. mois dernier",
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
