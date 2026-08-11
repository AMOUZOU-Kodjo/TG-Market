import { ShieldCheck, BadgeCheck, Star } from "lucide-react";
import Badge from "@/shared/ui/Badge";
import { cn } from "@/shared/utils/cn";

export default function SellerBadges({ seller, className }) {
  if (!seller) return null;

  return (
    <span className={cn("inline-flex flex-wrap items-center gap-1.5", className)}>
      {seller.verified && (
        <Badge variant="danger">
          <ShieldCheck className="h-3 w-3" />
          Profil vérifié
        </Badge>
      )}
      {seller.isTrusted && (
        <Badge variant="success">
          <BadgeCheck className="h-3 w-3" />
          Vendeur de confiance
        </Badge>
      )}
      {seller.isProfessional && (
        <Badge variant="primary">
          <Star className="h-3 w-3" />
          Profil Pro
        </Badge>
      )}
    </span>
  );
}
