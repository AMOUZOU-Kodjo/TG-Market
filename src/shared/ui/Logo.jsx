import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";
import tgLogo from "@/assets/logo-tg.png";

const SIZES = {
  sm: "w-28",
  md: "w-40",
  lg: "w-48",
  xl: "w-56",
};

export default function Logo({ size = "md", className = "" }) {
  const { siteName, siteLogo } = useSiteSettings();
  return (
    <img src={siteLogo || tgLogo} alt={siteName} className={`object-contain ${SIZES[size]} ${className}`} />
  );
}