import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";
import tgLogo from "@/assets/logo-tg.png";

const SIZES = {
  sm: "w-10 h-10",
  md: "w-20 h-20",
  lg: "w-14 h-14",
  xl: "w-16 h-16",
};

export default function Logo({ size = "md", className = "" }) {
  const { siteName } = useSiteSettings();
  return (
    <img src={tgLogo} alt={siteName} className={`object-contain ${SIZES[size]} ${className}`} />
  );
}
