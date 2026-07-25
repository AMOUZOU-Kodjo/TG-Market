import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {

  ArrowRight,
  ChevronRight,
  ChevronDown,
  Smartphone,
  Car,
  Laptop,
  Sofa,
  Shirt,
  Home,
  Refrigerator,
  Gamepad2,
  Dumbbell,
  Sparkles,
  Baby,
  Apple,
  Briefcase,
  PawPrint,
  BookOpen,
  Music,
  Palette,
  TreePine,
  GraduationCap,
  Crown,
  Scissors,
  Hammer,
  Wrench,
  PartyPopper,
  Camera,
  Bike,
  Footprints,
  ShoppingBag,
  Gem,
  Flower2,
  Sun,
  Package,
  Star,
  MapPin,
  Users,
  PackageCheck,
  ShieldCheck,
  CheckCircle2,
  Download,
  Play,
  Apple as AppleIcon,
  Zap,
  Shield,
  Send,
  FileText,
  MessageSquare,
  Heart,
} from "lucide-react";
import { mockCategories } from "@/data/categories";
import { mockProducts } from "@/data/products";
const recentProducts = mockProducts;
const popularProducts = mockProducts;
import { mockUsers } from "@/data/users";
import { mockReviews } from "@/data/reviews";
import Button from "@/shared/ui/Button";
import CategoryCard from "@/shared/ui/CategoryCard";
import ProductCard from "@/shared/ui/ProductCard";
import TestimonialCard from "@/shared/ui/TestimonialCard";
import Avatar from "@/shared/ui/Avatar";
import Badge from "@/shared/ui/Badge";
import { cn } from "@/shared/utils/cn";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const iconMap = {
  Smartphone,
  Car,
  Laptop,
  Sofa,
  Shirt,
  Home,
  Refrigerator,
  Gamepad2,
  Dumbbell,
  Sparkles,
  Baby,
  Apple,
  Briefcase,
  PawPrint,
  BookOpen,
  Music,
  Palette,
  TreePine,
  GraduationCap,
  Crown,
  Scissors,
  Hammer,
  Wrench,
  PartyPopper,
  Camera,
  Bike,
  Footprints,
  ShoppingBag,
  Gem,
  Flower2,
  Sun,
  Package,
};

const hexToColorKey = (hex) => {
  const map = {
    "#3B82F6": "blue",
    "#EF4444": "red",
    "#8B5CF6": "purple",
    "#F59E0B": "yellow",
    "#EC4899": "pink",
    "#10B981": "green",
    "#06B6D4": "teal",
    "#7C3AED": "purple",
    "#F97316": "orange",
    "#F472B6": "pink",
    "#FB923C": "orange",
    "#22C55E": "green",
    "#6366F1": "purple",
    "#A855F7": "purple",
    "#0EA5E9": "blue",
    "#D946EF": "purple",
    "#E11D48": "red",
    "#16A34A": "green",
    "#C8102E": "blue",
    "#D97706": "yellow",
    "#BE185D": "pink",
    "#78716C": "teal",
    "#0D9488": "teal",
    "#C084FC": "purple",
    "#475569": "teal",
    "#DC2626": "red",
    "#92400E": "yellow",
    "#7C2D12": "orange",
    "#CA8A04": "yellow",
    "#DB2777": "pink",
    "#B45309": "orange",
    "#FACC15": "yellow",
    "#6B7280": "teal",
  };
  return map[hex] || "orange";
};

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};


function SectionHeader({ title, subtitle, action, actionLabel = "Voir tout", className }) {
  return (
    <div className={cn("mb-8 flex items-end justify-between", className)}>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <Link
          to={action}
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-red-800 hover:text-red-900 transition-colors"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  const bgImages = [
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
  ];

  return (
    <section className="relative h-[600px] overflow-hidden sm:h-[650px] lg:h-[700px]">
      <style>{`
        .hero-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: rgba(255,255,255,0.5);
          opacity: 1;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background: #ffffff;
          width: 28px;
          border-radius: 5px;
        }
      `}</style>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        className="hero-swiper absolute inset-0 h-full w-full"
        style={{ zIndex: 0 }}
      >
        {bgImages.map((img, i) => (
          <SwiperSlide key={i}>
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${img})` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 bg-gray-900/60" style={{ zIndex: 1 }} />

      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ zIndex: 10 }}>
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" size="md" className="mb-6 bg-white/20 text-white border-white/30">
              <Sparkles className="h-3 w-3" />
              Bienvenue au marché togolais
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Achetez et vendez au Togo,{" "}
            <span className="relative">
              en toute simplicité
              <svg className="absolute -bottom-2 left-0 h-3 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C40 2 100 2 198 8" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base text-white/80 sm:text-lg lg:text-xl"
          >
            La première plateforme de marketplace au Togo. Trouvez des milliers d'articles d'occasion
            à prix imbattables ou vendez les vôtres en quelques clics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/vendre">
              <Button
                size="xl"
                icon={Send}
                className="bg-white text-black hover:bg-white  border-2 border-white/30"
              >
                Vendre un article
              </Button>
            </Link>
            <Link to="/categories">
              <Button
                variant="outline"
                size="xl"
                icon={ShoppingBag}
                className="border-white/40 text-white hover:bg-white/30"
              >
                Explorer les annonces
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/70"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-300" />
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-300" />
              <span>5 000+ utilisateurs</span>
            </div>
            <div className="flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-green-300" />
              <span>Livraison disponible</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const visibleCategories = mockCategories.slice(0, 10);

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Catégories populaires"
          subtitle="Explorez nos catégories les plus visitées"
          action="/categories"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          {visibleCategories.map((cat) => (
            <motion.div key={cat.id} variants={staggerItem}>
              <Link to={`/categories/${cat.slug}`}>
                <CategoryCard
                  icon={iconMap[cat.icon]}
                  name={cat.name}
                  count={cat.productCount}
                  color={hexToColorKey(cat.color)}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 text-center">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-red-400 hover:text-red-800 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-red-800"
          >
            Voir toutes les catégories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

function RecentListingsSection() {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="En ce moment"
          subtitle="Les annonces les plus récentes"
          action="/search?sort=newest"
        />

        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1.2}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              480: { slidesPerView: 2.2 },
              768: { slidesPerView: 3.2 },
              1024: { slidesPerView: 4 },
            }}
            className="px-4 sm:px-6 lg:px-8 !pb-12"
          >
            {recentProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <Link to={`/annonce/${product.id}`}>
                  <ProductCard
                    image={product.images?.[0]}
                    title={product.title}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    location={`${product.city}${product.district ? `, ${product.district}` : ""}`}
                    seller={product.seller}
                    condition={product.condition}
                    negotiable={product.negotiable}
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </motion.section>
  );
}

function PopularProductsSection() {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Produits populaires"
          subtitle="Les articles les plus vus de la semaine"
          action="/search?sort=popular"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          {popularProducts.slice(0, 8).map((product) => (
            <motion.div key={product.id} variants={staggerItem}>
              <Link to={`/annonce/${product.id}`}>
                <ProductCard
                  image={product.images?.[0]}
                  title={product.title}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  location={`${product.city}${product.district ? `, ${product.district}` : ""}`}
                  seller={product.seller}
                  condition={product.condition}
                  negotiable={product.negotiable}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

function VerifiedSellersSection() {
  const verifiedSellers = mockUsers.filter((u) => u.verified).slice(0, 10);

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Vendeurs vérifiés"
          subtitle="Nos vendeurs les mieux notés"
          action="/sellers"
        />

        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1.5}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              480: { slidesPerView: 2.5 },
              768: { slidesPerView: 3.5 },
              1024: { slidesPerView: 5 },
            }}
            className="px-4 sm:px-6 lg:px-8 !pb-12"
          >
            {verifiedSellers.map((seller) => (
              <SwiperSlide key={seller.id}>
                <Link to={`/profile/${seller.id}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="relative mx-auto mb-3 w-fit">
                      <Avatar src={seller.avatar} name={seller.name} size="lg" />
                      <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5 dark:bg-gray-900">
                        <ShieldCheck className="h-4 w-4 text-red-700" />
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {seller.name}
                    </h3>
                    <div className="mt-1 flex items-center justify-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {seller.rating}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({seller.reviewCount})
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {seller.productCount} annonces
                    </p>
                    <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
                      <MapPin className="h-3 w-3" />
                      {seller.city}
                    </div>
                  </motion.div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </motion.section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      icon: FileText,
      title: "Publiez votre annonce",
      description: "Créez votre annonce en quelques minutes. Ajoutez des photos, une description et un prix.",
      color: "bg-red-50 text-red-700 dark:bg-red-700/10",
    },
    {
      icon: MessageSquare,
      title: "Discutez avec les acheteurs",
      description: "Répondez aux questions, négociez le prix et convenez d'un lieu de rencontre.",
      color: "bg-green-50 text-green-700 dark:bg-green-700/10",
    },
    {
      icon: ShieldCheck,
      title: "Vendez en toute sécurité",
      description: "Rencontrez l'acheteur en personne ou utilisez notre service de livraison sécurisé.",
      color: "bg-red-50 text-red-700 dark:bg-red-700/10",
    },
  ];

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Comment ça marche ?
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Trois étapes simples pour acheter ou vendre
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative text-center"
            >
              <div className="relative mx-auto mb-6">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800">
                  <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl", step.color)}>
                    <step.icon className="h-7 w-7" />
                  </div>
                </div>
                <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-800 text-sm font-bold text-white shadow-lg shadow-red-800/25">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {step.description}
              </p>
              {i < steps.length - 1 && (
                <div className="absolute left-[calc(50%+60px)] top-10 hidden w-[calc(100%-120px)] md:block">
                  <div className="flex items-center justify-center">
                    <div className="h-0.5 w-full bg-red-300 dark:bg-red-800/20" />
                    <ChevronRight className="absolute right-0 h-5 w-5 text-red-400 dark:text-red-800/30" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function TestimonialsSection() {
  const displayedReviews = mockReviews.filter((r) => r.rating >= 4).slice(0, 6);

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Ce que disent nos utilisateurs
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Des milliers de transactions réussies chaque jour
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {displayedReviews.map((review) => (
            <motion.div key={review.id} variants={staggerItem}>
              <TestimonialCard
                avatar={review.reviewer.avatar}
                name={review.reviewer.name}
                rating={review.rating}
                text={review.comment}
                date={new Date(review.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

function DownloadAppSection() {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gray-900">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <Badge variant="secondary" size="md" className="mb-6 bg-white/10 text-white border-white/20">
                <Download className="h-3 w-3" />
                Application mobile
              </Badge>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Téléchargez l'application AK Market
              </h2>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Achetez et vendez directement depuis votre smartphone. Notifications en temps réel,
                messagerie instantanée et paiement sécurisé.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 transition-colors hover:bg-gray-100">
                  <AppleIcon className="h-7 w-7 text-gray-900" />
                  <div className="text-left">
                    <p className="text-[10px] text-gray-500">Télécharger sur</p>
                    <p className="text-sm font-semibold text-gray-900">App Store</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 transition-colors hover:bg-gray-100">
                  <Play className="h-7 w-7 text-gray-900" />
                  <div className="text-left">
                    <p className="text-[10px] text-gray-500">Disponible sur</p>
                    <p className="text-sm font-semibold text-gray-900">Google Play</p>
                  </div>
                </button>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { icon: Zap, label: "Rapide" },
                  { icon: Shield, label: "Sécurisé" },
                  { icon: Heart, label: "Gratuit" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm text-gray-400">
                    <item.icon className="h-4 w-4 text-red-700" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:flex lg:items-center lg:justify-center lg:p-8">
              <div className="relative h-80 w-56 overflow-hidden rounded-[2.5rem] bg-gray-700 shadow-2xl ring-4 ring-gray-600/50">
                <div className="absolute inset-x-0 top-0 z-10 h-6 bg-gray-900" />
                <img
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=800&fit=crop"
                  alt="AK Market App"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gray-900/60" />
              </div>
              <div className="absolute -right-4 bottom-20 rotate-6 rounded-xl bg-white p-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                    <CheckCircle2 className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Vente effectuée</p>
                    <p className="text-[10px] text-gray-500">Il y a 2 minutes</p>
                  </div>
                </div>
              </div>
              <div className="absolute -left-4 top-24 -rotate-3 rounded-xl bg-white p-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-200">
                    <Star className="h-5 w-5 text-red-800" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Nouvel avis 5★</p>
                    <p className="text-[10px] text-gray-500">Kofi A.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <RecentListingsSection />
      <PopularProductsSection />
      <VerifiedSellersSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <DownloadAppSection />
    </div>
  );
}
