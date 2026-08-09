import { AlertTriangle, CheckCircle2, Clock, Smartphone } from "lucide-react";
import { formatCFA } from "@/shared/utils/format";

const PROVIDER_LABELS = {
  flooz: "Flooz",
  tmoney: "T-Money",
  mobile_money: "Mobile Money",
};

const STYLES = {
  sent: {
    box: "border-green-100 bg-green-50 dark:border-green-800/60 dark:bg-green-900/10",
    icon: "text-green-600",
    title: "text-green-800 dark:text-green-400",
    body: "text-green-600 dark:text-green-500",
    Icon: Smartphone,
  },
  paid: {
    box: "border-green-100 bg-green-50 dark:border-green-800/60 dark:bg-green-900/10",
    icon: "text-green-600",
    title: "text-green-800 dark:text-green-400",
    body: "text-green-600 dark:text-green-500",
    Icon: Smartphone,
  },
  pending: {
    box: "border-amber-100 bg-amber-50 dark:border-amber-800/60 dark:bg-amber-900/10",
    icon: "text-amber-600",
    title: "text-amber-800 dark:text-amber-400",
    body: "text-amber-600 dark:text-amber-500",
    Icon: Clock,
  },
  failed: {
    box: "border-red-100 bg-red-50 dark:border-red-800/60 dark:bg-red-900/10",
    icon: "text-red-600",
    title: "text-red-800 dark:text-red-400",
    body: "text-red-600 dark:text-red-500",
    Icon: AlertTriangle,
  },
};

const FALLBACK = {
  box: "border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800",
  icon: "text-gray-500",
  title: "text-gray-800 dark:text-gray-300",
  body: "text-gray-500 dark:text-gray-400",
  Icon: Clock,
};

export default function PayoutNotice({ payout, isSeller }) {
  if (!payout) return null;

  const style = STYLES[payout.status] ?? FALLBACK;
  const provider = PROVIDER_LABELS[payout.provider] ?? (payout.provider ? String(payout.provider).toUpperCase() : null);
  const destination = [provider, payout.account].filter(Boolean).join(" · ");
  const { Icon } = style;

  const title =
    payout.status === "sent" || payout.status === "paid"
      ? `Votre paiement de ${formatCFA(payout.amount)} a été envoyé`
      : payout.status === "failed"
        ? "Échec de l'envoi de votre paiement"
        : "Votre paiement est en cours de traitement";

  const body = isSeller
    ? payout.status === "sent" || payout.status === "paid"
      ? destination
        ? `Le règlement a été lancé sur votre compte ${destination} (frais de service déjà déduits).`
        : "Le règlement a été lancé sur votre moyen de réception (frais de service déjà déduits)."
      : payout.status === "failed"
        ? "Un problème est survenu lors de l'envoi. Notre équipe va vous contacter pour régulariser."
        : destination
          ? `Le versement de ${formatCFA(payout.amount)} sera effectué sur ${destination}.`
          : "Votre versement sera traité prochainement par notre équipe."
    : "Le vendeur a été réglé. Merci pour votre confiance.";

  return (
    <div className={`${style.box} rounded-2xl border p-4`}>
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 ${style.icon}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className={`text-sm font-semibold ${style.title}`}>{title}</p>
          <p className={`mt-1 text-xs ${style.body}`}>{body}</p>
          {isSeller && payout.status === "failed" && payout.errorMessage && (
            <p className={`mt-1 text-[11px] ${style.body} opacity-80`}>{payout.errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}