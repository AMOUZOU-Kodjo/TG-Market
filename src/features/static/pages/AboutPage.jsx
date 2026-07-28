import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  Globe,
  Shield,
  Users,
  TrendingUp,
  MapPin,
  Smartphone,
  Star,
  ArrowRight,
  Target,
  Handshake,
  Sparkles,
  CheckCircle2,
  Phone,
  MessageCircle,
  ShieldCheck,
  Zap,
  Clock,
  Truck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Button from "@/shared/ui/Button";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";
import { usePublicStats, usePublicReviews } from "@/features/home/hooks/usePublicStats";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

const values = [
  {
    icon: Shield,
    title: "Confiance & Sécurité",
    description: "Chaque transaction est protégée. Nous vérifions les profils et encourageons les rencontres en personne pour des échanges en toute sérénité.",
  },
  {
    icon: Heart,
    title: "Communauté Togolaise",
    description: "TG-Market est né au Togo, pour le Togo. Notre plateforme est conçue pour répondre aux besoins spécifiques des Togolais.",
  },
  {
    icon: Handshake,
    title: "Commerce Juste",
    description: "Nous croyons en un commerce équitable qui profite à tous. Pas de frais cachés, pas de commissions abusives.",
  },
  {
    icon: Sparkles,
    title: "Innovation Locale",
    description: "Paiement mobile, livraison locale, support en français. Tout est pensé pour faciliter vos échanges quotidiens.",
  },
];

const teamMembers = [
  {
    name: "Amouzou Kodjo",
    role: "Co-fondateur & Développeur Frontend",
    initials: "AK",
    color: "bg-brand-100 text-brand-800 dark:bg-brand-900/30",
    bio: "Architecte de l\u2019interface TG-Market. Passionné par les interfaces fluides et l\u2019expérience utilisateur mobile.",
  },
  {
    name: "Awougno Kofi Yosua",
    role: "Co-fondateur & Développeur Backend",
    initials: "AY",
    color: "bg-brand-100 text-brand-800 dark:bg-brand-900/30",
    bio: "Cerveau technique derrière l\u2019API, la sécurité et l\u2019infrastructure. Garant de la fiabilité du système.",
  },
];

const timeline = [
  { year: "2021", title: "L\u2019idée est née", description: "Face au manque de plateforme locale, les fondateurs imaginent un marketplace 100% togolais." },
  { year: "2022", title: "Premier prototype", description: "L\u2019app est testée à Lomé avec 200 beta-testeurs. Les premières ventes ont lieu." },
  { year: "2023", title: "Lancement officiel", description: "TG-Market est lancé publiquement. 5 000 utilisateurs en 3 mois." },
  { year: "2024", title: "Expansion nationale", description: "Déploiement à Kara, Sokodé, Kpalimé et Atakpamé. 24 000 utilisateurs actifs." },
  { year: "2025", title: "Paiement & Livraison", description: "Intégration Flooz, TMoney et livraison locale. Le séquestre s\u2019étoffe." },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Séquestre sécurisé",
    description: "L\u2019argent est bloqué jusqu\u2019à confirmation de réception par l\u2019acheteur. Zéro arnaque possible.",
  },
  {
    icon: MapPin,
    title: "Points de rencontre",
    description: "Des lieux partenaires sécurisés à Lomé, Kara et autres villes pour vos échanges en personne.",
  },
  {
    icon: Truck,
    title: "Livraison locale",
    description: "Faites livrer vos colis directement à domicile ou en point relais à travers tout le Togo.",
  },
  {
    icon: MessageCircle,
    title: "Messagerie intégrée",
    description: "Échangez directement avec les vendeurs dans l\u2019app. Négociez, posez des questions, proposez des RDV.",
  },
  {
    icon: Phone,
    title: "Paiement mobile",
    description: "Flooz, TMoney, Mobile Money ou carte bancaire. Payez comme vous voulez, où que vous soyez.",
  },
  {
    icon: Clock,
    title: "Annonces en temps réel",
    description: "Recevez des alertes instantanées quand un article qui vous intéresse est publié.",
  },
];

export default function AboutPage() {
  const [openTimeline, setOpenTimeline] = useState(0);
  const { siteName } = useSiteSettings();
  const { data: publicStats } = usePublicStats();
  const testimonials = usePublicReviews().data ?? [];

  const fmt = (val, suffix = "") => {
    const n = Number(val);
    return Number.isFinite(n) && n > 0 ? `${n.toLocaleString("fr-FR")}${suffix}` : "—";
  };

  const stats = publicStats
    ? [
        { value: fmt(publicStats.totalUsers, "+"), label: "Utilisateurs actifs", icon: Users },
        { value: fmt(publicStats.totalListings, "+"), label: "Annonces publiées", icon: TrendingUp },
        { value: fmt(publicStats.totalSales, "+"), label: "Ventes réalisées", icon: Star },
        { value: fmt(publicStats.cities, "+"), label: "Villes couvertes", icon: MapPin },
      ]
    : [];
  const milestones = publicStats
    ? [
        { icon: Users, value: fmt(publicStats.totalUsers, "+"), label: "Utilisateurs actifs" },
        { icon: TrendingUp, value: fmt(publicStats.totalListings, "+"), label: "Annonces publiées" },
        { icon: Star, value: fmt(publicStats.totalSales, "+"), label: "Ventes réalisées" },
        { icon: MapPin, value: fmt(publicStats.cities, "+"), label: "Villes couvertes" },
        { icon: ShieldCheck, value: fmt(publicStats.verifiedUsers, "+"), label: "Comptes vérifiés" },
        { icon: Zap, value: fmt(publicStats.moderationTime, "h"), label: "Délai de modération" },
      ]
    : [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-800 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/10" />
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-500/5" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-yellow-400">
              À propos de nous
            </p>
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
              Le {siteName} du{" "}
              <span className="text-yellow-400">Togo</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
              {siteName} connecte les vendeurs et acheteurs à travers tout le Togo.
              Achetez, vendez et échangez en toute confiance.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/">
              <Button size="lg" icon={ArrowRight} iconPosition="right" className="bg-white text-brand-900 hover:bg-gray-100">
                Explorer {siteName}
              </Button>
            </Link>
            <Link to="/faq">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                En savoir plus
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
          >
            {milestones.map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="rounded-2xl border border-gray-100 bg-white p-5 text-center dark:border-gray-800 dark:bg-gray-800"
              >
                <stat.icon className="mx-auto mb-2 h-6 w-6 text-brand-800" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-800/50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Notre histoire</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              D{"'"}une idée simple à la plus grande marketplace du Togo
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700 sm:left-1/2" />
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative mb-8 flex items-start gap-6 ${
                  i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                <div className="hidden sm:block sm:w-1/2" />
                <div className="absolute left-4 top-1 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-brand-800 bg-white dark:bg-gray-800 sm:left-1/2" />
                <div className="ml-10 sm:ml-0 sm:w-1/2">
                  <button
                    onClick={() => setOpenTimeline(openTimeline === i ? -1 : i)}
                    className="w-full text-left"
                  >
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-brand-800">{item.year}</span>
                          <h3 className="mt-1 text-base font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                        </div>
                        {openTimeline === i ? (
                          <ChevronUp className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      {openTimeline === i && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400"
                        >
                          {item.description.replace(/TG-Market/g, siteName)}
                        </motion.p>
                      )}
                    </div>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800 sm:p-12"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/20">
              <Target className="h-7 w-7 text-brand-800" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Notre mission</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Rendre le commerce accessible à tous les Togolais. Que vous soyez à Lomé, Kara, Sokodé ou Kpalimé,
              {siteName} vous permet de vendre et acheter en toute simplicité. Nous croyons que chaque Togolais
              mérite une plateforme fiable, sécurisée et pensée pour lui.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-800/50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Nos valeurs</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Les principes qui guident notre action au quotidien
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {values.map((value, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/20">
                  <value.icon className="h-6 w-6 text-brand-800" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {value.description.replace(/TG-Market/g, siteName)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Ce que nous offrons */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Ce que nous offrons</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Des fonctionnalités pensées pour les Togolais
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="rounded-2xl border border-gray-100 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/20">
                  <feature.icon className="h-6 w-6 text-brand-800" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Équipe */}
      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-800/50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Notre équipe</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Des passionnés au service du digital togolais
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2"
          >
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800"
              >
                <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold ring-4 ring-gray-100 dark:ring-gray-800 ${member.color}`}>
                  {member.initials}
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-brand-800 dark:text-brand-400">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {member.bio.replace(/TG-Market/g, siteName)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Ce qu{"'"}ils en disent</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              La voix de notre communauté
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-3"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800"
              >
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`h-4 w-4 ${j < t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 dark:text-gray-700"}`}
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800 dark:bg-brand-900/30">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-[10px] text-gray-400">{t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-brand-800 p-8 text-center text-white sm:p-12"
          >
            <h2 className="text-2xl font-bold sm:text-3xl">
              Rejoignez {siteName} aujourd{"'"}hui
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/80">
              Que vous soyez vendeur ou acheteur, {siteName} est la meilleure
              plateforme pour vos échanges au Togo.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/inscription">
                <Button size="lg" className="bg-white text-brand-900 hover:bg-gray-100">
                  Créer un compte gratuit
                </Button>
              </Link>
              <Link to="/vendre">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Commencer à vendre
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
