import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import {
  ShieldCheck,
  Zap,
  Car,
  CreditCard,
  Package,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const SLIDES = [
  {
    id: 1,
    badge: "Sécurité garantie",
    title: "Achetez en toute confiance",
    description:
      "Découvrez des milliers d'annonces vérifiées partout au Togo.",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&q=80",
    accent: "#C8102E",
  },
  {
    id: 2,
    badge: "Publication rapide",
    title: "Vendez rapidement",
    description: "Publiez une annonce en moins de deux minutes.",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=1200&q=80",
    accent: "#006B3F",
  },
  {
    id: 3,
    badge: "Véhicules d'occasion",
    title: "Véhicules d'occasion",
    description:
      "Moto, voiture, vélo, scooter... trouvez votre prochain moyen de transport.",
    icon: Car,
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
    accent: "#FFCE00",
  },
  {
    id: 4,
    badge: "Transactions sécurisées",
    title: "Paiement sécurisé",
    description:
      "Votre argent reste protégé jusqu'à la confirmation de la transaction.",
    icon: CreditCard,
    image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200&q=80",
    accent: "#C8102E",
  },
  {
    id: 5,
    badge: "Marketplace togolaise",
    title: "Toute la seconde main du Togo",
    description:
      "Une plateforme unique pour acheter, vendre et donner une seconde vie à vos objets.",
    icon: Package,
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1200&q=80",
    accent: "#006B3F",
  },
];

const kenBurns = `
@keyframes kenBurns {
  0% { transform: scale(1) translate(0, 0); }
  50% { transform: scale(1.12) translate(-1%, -1%); }
  100% { transform: scale(1) translate(0, 0); }
}
`;

function BackgroundImage({ src, isActive }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <style>{kenBurns}</style>
      <img
        src={src}
        alt=""
        loading="lazy"
        className={`h-full w-full object-cover transition-opacity duration-700 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        style={{
          animation: isActive ? "kenBurns 8s ease-in-out infinite" : "none",
        }}
      />
    </div>
  );
}

function HeroOverlay() {
  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
  );
}

const contentVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 },
  },
  exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function HeroContent({ slide, isActive }) {
  const Icon = slide.icon;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={slide.id}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative z-10 flex h-full flex-col justify-end px-8 pb-16 sm:px-12 lg:px-16"
        >
          <motion.div variants={itemVariants} className="mb-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
              <Icon className="h-3.5 w-3.5" />
              {slide.badge}
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="mb-3 max-w-lg text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl"
          >
            {slide.title}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mb-8 max-w-md text-sm leading-relaxed text-white/80 sm:text-base"
          >
            {slide.description}
          </motion.p>

          <motion.div variants={itemVariants}>
            <button
              className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: slide.accent }}
            >
              Découvrir
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HeroIndicators({ total, activeIndex, onDotClick }) {
  return (
    <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          aria-label={`Aller au slide ${i + 1}`}
          className={`h-2 rounded-full transition-all duration-500 ${
            i === activeIndex
              ? "w-8 bg-white"
              : "w-2 bg-white/40 hover:bg-white/60"
          }`}
        />
      ))}
    </div>
  );
}

function HeroNavigation({ onPrev, onNext }) {
  return (
    <div className="absolute right-8 top-1/2 z-20 -translate-y-1/2 gap-2 lg:flex hidden">
      <button
        onClick={onPrev}
        aria-label="Slide précédent"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/25 hover:scale-110"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={onNext}
        aria-label="Slide suivant"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/25 hover:scale-110"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

function HeroProgressBar({ isActive, duration, accent }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/10">
      {isActive && (
        <motion.div
          key={`progress-${Date.now()}`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className="h-full rounded-full"
          style={{ backgroundColor: accent }}
        />
      )}
    </div>
  );
}

const MemoizedBackgroundImage = memo(BackgroundImage);
const MemoizedHeroOverlay = memo(HeroOverlay);

export default function AuthHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperRef, setSwiperRef] = useState(null);

  const handleSlideChange = useCallback((swiper) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  const goNext = useCallback(() => {
    swiperRef?.slideNext();
  }, [swiperRef]);

  const goPrev = useCallback(() => {
    swiperRef?.slidePrev();
  }, [swiperRef]);

  const goTo = useCallback(
    (index) => {
      swiperRef?.slideTo(index);
    },
    [swiperRef]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Logo */}
      <div className="absolute left-8 top-8 z-30">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
            <span className="text-lg font-bold text-white">AK</span>
          </div>
          <span className="text-xl font-bold text-white">Market</span>
        </div>
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop
        pagination={false}
        onSwiper={setSwiperRef}
        onSlideChange={handleSlideChange}
        className="h-full w-full"
        a11y={{ prevSlideMessage: "Slide précédent", nextSlideMessage: "Slide suivant" }}
      >
        {SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <MemoizedBackgroundImage
                src={slide.image}
                isActive={index === activeIndex}
              />
              <MemoizedHeroOverlay />
              <HeroContent slide={slide} isActive={index === activeIndex} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Indicators */}
      <HeroIndicators
        total={SLIDES.length}
        activeIndex={activeIndex}
        onDotClick={goTo}
      />

      {/* Navigation */}
      <HeroNavigation onPrev={goPrev} onNext={goNext} />

      {/* Progress Bar */}
      <HeroProgressBar
        isActive={true}
        duration={6000}
        accent={SLIDES[activeIndex].accent}
      />
    </div>
  );
}
