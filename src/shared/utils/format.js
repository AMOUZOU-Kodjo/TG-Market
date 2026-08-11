const CFA_FORMATTER = new Intl.NumberFormat("fr-FR", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCFA(amount) {
  if (amount == null || isNaN(amount)) return "0 FCFA";
  return `${CFA_FORMATTER.format(Number(amount))} FCFA`;
}

export function formatCurrency(amount) {
  return formatCFA(amount);
}

export function formatDate(date, options = {}) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const defaults = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return d.toLocaleDateString("fr-FR", { ...defaults, ...options });
}

export function formatDateTime(date) {
  return formatDate(date, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(date) {
  return formatDate(date, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date) {
  return formatDate(date, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPhone(phone) {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 8) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4");
  }
  if (cleaned.length === 10 && cleaned.startsWith("228")) {
    return `+228 ${cleaned.slice(3).replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4")}`;
  }
  return phone;
}

export function formatFileSize(bytes) {
  if (bytes == null || isNaN(bytes) || bytes === 0) return "0 octets";
  const units = ["octets", "Ko", "Mo", "Go", "To"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const index = Math.min(i, units.length - 1);
  const size = bytes / Math.pow(k, index);
  return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

const RELATIVE_TIME_THRESHOLDS = [
  { unit: "year", ms: 365 * 24 * 60 * 60 * 1000 },
  { unit: "month", ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: "week", ms: 7 * 24 * 60 * 60 * 1000 },
  { unit: "day", ms: 24 * 60 * 60 * 1000 },
  { unit: "hour", ms: 60 * 60 * 1000 },
  { unit: "minute", ms: 60 * 1000 },
];

const RELATIVE_TIME_LABELS = {
  year: { singular: "an", plural: "ans" },
  month: { singular: "mois", plural: "mois" },
  week: { singular: "semaine", plural: "semaines" },
  day: { singular: "jour", plural: "jours" },
  hour: { singular: "heure", plural: "heures" },
  minute: { singular: "minute", plural: "minutes" },
};

export function formatRelativeTime(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const now = Date.now();
  const diff = now - d.getTime();

  if (diff < 0) return "à l'instant";

  for (const { unit, ms } of RELATIVE_TIME_THRESHOLDS) {
    const value = Math.floor(diff / ms);
    if (value >= 1) {
      const labels = RELATIVE_TIME_LABELS[unit];
      const label = value === 1 ? labels.singular : labels.plural;
      return `il y a ${value} ${label}`;
    }
  }

  return "à l'instant";
}

export function formatNumber(num, options = {}) {
  if (num == null || isNaN(num)) return "0";
  const { compact = false, decimals = 0 } = options;

  if (compact) {
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, "")} Md`;
    }
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")} M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1).replace(/\.0$/, "")} k`;
    }
  }

  return CFA_FORMATTER.format(Number(num.toFixed(decimals)));
}

export function formatListingPrice(price, isNegotiable = false) {
  const formatted = formatCFA(price);
  return isNegotiable ? `${formatted} (négociable)` : formatted;
}

export function truncate(str, maxLength = 50) {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * Adaptateur Backend → Frontend
 * Convertit le shape API (first_name/last_name) vers le shape frontend (name)
 * Utilisation : formatUser(apiUser) → { ...apiUser, name: "Kofi Améyo", firstName: "Kofi", ... }
 */
export function formatUser(apiUser) {
  if (!apiUser) return null;

  const firstName = apiUser.first_name || "";
  const lastName = apiUser.last_name || "";
  const name = `${firstName} ${lastName}`.trim() || apiUser.name || "";

  return {
    ...apiUser,
    firstName,
    lastName,
    name,
    joinedAt: apiUser.created_at || apiUser.joinedAt || null,
    verified: apiUser.identity_verified ?? apiUser.verified ?? false,
    rating: apiUser.rating_avg ?? apiUser.rating ?? 0,
    reviewCount: apiUser.review_count ?? apiUser.reviewCount ?? 0,
    productCount: apiUser.product_count ?? apiUser.productCount ?? 0,
    followerCount: apiUser.follower_count ?? apiUser.followerCount ?? 0,
    followingCount: apiUser.following_count ?? apiUser.followingCount ?? 0,
    isProfessional: apiUser.is_professional ?? false,
    isTrusted: apiUser.is_trusted ?? false,
    notificationsEmail: apiUser.notifications_email ?? true,
    notificationsPush: apiUser.notifications_push ?? true,
    notificationsSms: apiUser.notifications_sms ?? false,
    profileVisibility: apiUser.profile_visibility ?? "public",
    showPhone: apiUser.show_phone ?? false,
    showLocation: apiUser.show_location ?? true,
    preferredLanguage: apiUser.preferred_language ?? "fr",
    preferredCurrency: apiUser.preferred_currency ?? "FCFA",
  };
}

/**
 * Adaptateur inversé : Frontend → Backend (pour les submits/forms)
 */
export function toBackendUser(frontendUser) {
  if (!frontendUser) return null;

  const [firstName = "", ...rest] = (frontendUser.name || "").split(" ");
  const lastName = rest.join(" ");

  return {
    ...frontendUser,
    first_name: firstName,
    last_name: lastName,
    identity_verified: frontendUser.verified,
    rating_avg: frontendUser.rating,
    review_count: frontendUser.reviewCount,
    product_count: frontendUser.productCount,
    follower_count: frontendUser.followerCount,
    following_count: frontendUser.followingCount,
    is_professional: frontendUser.isProfessional,
    is_trusted: frontendUser.isTrusted,
    notifications_email: frontendUser.notificationsEmail,
    notifications_push: frontendUser.notificationsPush,
    notifications_sms: frontendUser.notificationsSms,
    profile_visibility: frontendUser.profileVisibility,
    show_phone: frontendUser.showPhone,
    show_location: frontendUser.showLocation,
    preferred_language: frontendUser.preferredLanguage,
    preferred_currency: frontendUser.preferredCurrency,
    created_at: frontendUser.joinedAt,
  };
}
