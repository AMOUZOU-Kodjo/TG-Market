import { useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/shared/services/api";
import { Package } from "lucide-react";
import Logo from "@/shared/ui/Logo";
import { formatCFA } from "@/shared/utils/format";

const FALLBACK = {
  id: 0,
  badge: "Marketplace togolaise",
  title: "Achetez et vendez au Togo",
  price: "",
  image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1200&q=80",
};

function ProductImg({ src }) {
  return src ? (
    <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
  ) : (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
      <Package className="h-6 w-6 text-gray-500" />
    </div>
  );
}

const COLORS = ["#014D46", "#C8102E", "#006B3F", "#FFCE00"];

function ScrollingColumn({ cards, from, to }) {
  const items = cards.length > 0 ? cards : Array(4).fill(FALLBACK);
  const duplicated = [...items, ...items];

  return (
    <div className="relative w-1/2" style={{ height: "100%" }}>
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [from, to] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="relative"
          style={{ height: "200%" }}
        >
          {duplicated.map((slide, i) => (
            <div key={`${slide.id}-${i}`} className="relative" style={{ height: "12.5%" }}>
              <ProductImg src={slide.image} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="relative z-10 flex h-full flex-col justify-end p-3 sm:p-4">
                <span
                  className="mb-1 inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                  style={{ backgroundColor: COLORS[i % 4] }}
                >
                  {slide.badge}
                </span>
                <h3 className="text-xs font-bold leading-tight text-white sm:text-sm line-clamp-2">
                  {slide.title}
                </h3>
                {slide.price && (
                  <p className="mt-0.5 text-[11px] font-semibold text-white/90 sm:text-xs">
                    {formatCFA(slide.price)}
                  </p>
                )}
              </div>
            </div>
        ))}
      </motion.div>
    </div>
  </div>
  );
}

function CarouselSlides() {
  const { data: productsData } = useQuery({
    queryKey: ["authHeroProducts"],
    queryFn: () => api.get("/search", { params: { perPage: 8, sort: "newest" } }).then((r) => r.data),
    staleTime: 60000,
  });

  const slides = useMemo(() => {
    const products = productsData?.data || [];
    if (products.length === 0) return Array(8).fill(FALLBACK);
    return products.map((p) => ({
      id: p.id,
      badge: p.city || "Nouvelle annonce",
      title: p.title,
      price: p.price,
      image: p.images?.[0] || "",
    }));
  }, [productsData]);

  const leftCards = slides.slice(0, 4);
  const rightCards = slides.slice(4, 8);

  return (
    <div className="flex h-full w-full">
      <ScrollingColumn cards={leftCards} from="0" to="-50%" />
      <ScrollingColumn cards={rightCards} from="-50%" to="0" />
    </div>
  );
}

export function AuthHeroBg() {
  return (
    <div className="relative h-full w-full bg-black">
      <CarouselSlides />
    </div>
  );
}

export default function AuthHeroCarousel() {
  return (
    <div className="relative h-full w-full bg-black">
      <div className="absolute left-6 top-20 z-20">
        <div className="flex items-center gap-2.5">
          <Logo size="lg" className="bg-white/15 backdrop-blur-md shadow-none" />
        </div>
      </div>

      <CarouselSlides />
    </div>
  );
}
