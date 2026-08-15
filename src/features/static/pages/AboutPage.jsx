import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Target, Handshake, Sparkles, Heart, ShieldCheck } from "lucide-react";
import { FaLinkedinIn, FaFacebookF, FaXTwitter, FaInstagram, FaGithub } from "react-icons/fa6";
import Button from "@/shared/ui/Button";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";
import { usePublicStats, usePublicReviews } from "@/features/home/hooks/usePublicStats";

const sections = [
  { id: "histoire", label: "Notre histoire" },
  { id: "mission", label: "Notre mission" },
  { id: "valeurs", label: "Nos valeurs" },
  { id: "equipe", label: "Notre équipe" },
  { id: "avis", label: "Ils nous font confiance" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Confiance & Sécurité",
    description: "Chaque transaction est protégée par le paiement séquestre. Nous vérifions les profils pour des échanges en toute sérénité.",
  },
  {
    icon: Heart,
    title: "Communauté Togolaise",
    description: "TG-Market est né au Togo, pour le Togo. Notre plateforme est pensée pour les besoins réels des Togolais.",
  },
  {
    icon: Handshake,
    title: "Commerce juste",
    description: "Pas de frais cachés, pas de commissions abusives. Un commerce équitable qui profite à tous.",
  },
  {
    icon: Sparkles,
    title: "Innovation locale",
    description: "Paiement mobile, livraison locale, support en français : tout est pensé pour simplifier vos échanges.",
  },
];

const timeline = [
  { year: "2025", title: "Lancement officiel", description: "La plateforme ouvre ses portes à Lomé et connecte les premiers vendeurs et acheteurs togolais." },
  { year: "2025", title: "Paiement mobile", description: "Intégration de Flooz et T-Money : payer directement depuis l'application, sans carte bancaire." },
  { year: "2026", title: "Expansion nationale", description: "Déploiement à Kara, Sokodé, Kpalimé et Atakpamé. Plus de 24 000 utilisateurs actifs." },
  { year: "2026", title: "Séquestre & confiance", description: "Mise en place du système de séquestre et du code de confirmation pour des transactions 100% sécurisées." },
];

const TEAM_FALLBACKS = [
  { name: "Amouzou Kodjo", role: "Co-fondateur & Développeur Frontend", initials: "AK", photo: "", bio: "Architecte de l'interface TG-Market.", linkedin: "#", facebook: "#", twitter: "#", instagram: "#", github: "#" },
  { name: "Awougno Kofi Yosua", role: "Co-fondateur & Développeur Backend", initials: "AY", photo: "", bio: "Cerveau technique derrière l'API.", linkedin: "#", facebook: "#", twitter: "#", instagram: "#", github: "#" },
];

export default function AboutPage() {
  const navigate = useNavigate();
  const { siteName, teamMembers } = useSiteSettings();
  const members = Array.isArray(teamMembers) && teamMembers.length > 0 ? teamMembers : TEAM_FALLBACKS;
  const { data: publicStats } = usePublicStats();
  const testimonials = usePublicReviews().data ?? [];

  const fmt = (val, suffix = "") => {
    const n = Number(val);
    return Number.isFinite(n) && n > 0 ? `${n.toLocaleString("fr-FR")}${suffix}` : "—";
  };

  const stats = publicStats
    ? [
        { value: fmt(publicStats.totalUsers, "+"), label: "Utilisateurs actifs" },
        { value: fmt(publicStats.totalListings, "+"), label: "Annonces publiées" },
        { value: fmt(publicStats.totalSales, "+"), label: "Ventes sécurisées" },
        { value: fmt(publicStats.cities, "+"), label: "Villes couvertes" },
      ]
    : [];

  useEffect(() => {
    const handleAnchor = () => {
      const hash = window.location.hash;
      if (hash) {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("hashchange", handleAnchor);
    return () => window.removeEventListener("hashchange", handleAnchor);
  }, []);

  return (
    <div className="min-h-screen">
      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden bg-brand-800 text-white">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="absolute inset-0 grid h-full w-full grid-cols-3 gap-0 sm:grid-cols-4 md:grid-cols-6">
          {Array.from({ length: 18 }).map((_, i) => {
            const m = members[i % members.length];
            return m.photo ? (
              <img key={i} src={m.photo} alt="" className="h-full w-full object-cover opacity-10" />
            ) : (
              <div key={i} className="flex items-center justify-center bg-brand-900/40 text-3xl font-bold text-white/[0.06]">
                {m?.initials ?? ""}
              </div>
            );
          })}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/70 via-brand-800/50 to-brand-900/70" />

        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-24 text-center sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="mb-4 inline-flex items-center rounded-full bg-yellow-400/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-yellow-300 ring-1 ring-yellow-400/30">
              À propos de {siteName}
            </span>
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
              Le {siteName} du <span className="text-yellow-400">Togo</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85">
              Depuis Lomé, nous connectons les vendeurs et acheteurs de tout le pays.
              Une marketplace togolaise, simple, rapide et sécurisée.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ Chiffres clés ═══ */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 text-center">
              <p className="text-3xl font-bold text-brand-800 dark:text-brand-400">{stat.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Sticky section nav ═══ */}
      <div className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex max-w-4xl items-center gap-1 overflow-x-auto px-4 py-2 hide-scrollbar sm:justify-center sm:px-6">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-brand-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-brand-400"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* ═══ Notre histoire ═══ */}
      <section id="histoire" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-brand-800">Notre histoire</span>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              D'une idée simple à la marketplace n°1 du Togo
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-brand-800 via-gray-200 to-transparent dark:via-gray-700 sm:left-1/2" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative flex sm:w-1/2 ${i % 2 === 0 ? "sm:pr-12" : "sm:ml-auto sm:pl-12"}`}
                >
                  <span
                    className={`absolute left-4 top-1.5 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-brand-800 bg-white dark:bg-gray-900 sm:left-auto ${
                      i % 2 === 0 ? "sm:left-full" : "sm:left-0"
                    }`}
                  />
                  <div className={`ml-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-800 sm:ml-0`}>
                    <span className="text-xs font-bold text-brand-800">{item.year}</span>
                    <h3 className="mt-1 text-base font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {item.description.replace(/TG-Market/g, siteName)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Mission ═══ */}
      <section id="mission" className="scroll-mt-20 bg-gray-50 px-4 py-16 dark:bg-gray-800/50 sm:px-6 lg:px-8">
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
            <span className="text-xs font-bold uppercase tracking-widest text-brand-800">Notre mission</span>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Rendre le commerce accessible à tous les Togolais
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Que vous soyez à Lomé, Kara, Sokodé ou Kpalimé, {siteName} vous permet de vendre et
              acheter en toute simplicité. Nous croyons que chaque Togolais mérite une plateforme
              fiable, sécurisée et pensée pour lui.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ Valeurs ═══ */}
      <section id="valeurs" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-brand-800">Nos valeurs</span>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              Les principes qui nous guident
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-800 dark:hover:border-brand-700"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 transition-colors group-hover:bg-brand-800 dark:bg-brand-900/20 dark:group-hover:bg-brand-800">
                  <value.icon className="h-6 w-6 text-brand-800 transition-colors group-hover:text-white dark:text-brand-400 dark:group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {value.description.replace(/TG-Market/g, siteName)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Équipe ═══ */}
      <section id="equipe" className="scroll-mt-20 bg-gray-50 px-4 py-16 dark:bg-gray-800/50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-brand-800">Notre équipe</span>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              Des passionnés au service du digital togolais
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2">
            {members.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-gray-100 bg-white p-8 text-center transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-800"
              >
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-gray-100 dark:ring-gray-800"
                  />
                ) : (
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-800 ring-4 ring-gray-100 dark:bg-brand-900/30 dark:ring-gray-800">
                    {member.initials}
                  </div>
                )}
                <h3 className="mt-4 text-base font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-brand-800 dark:text-brand-400">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {member.bio?.replace(/TG-Market/g, siteName)}
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  <a href={member.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A66C2] text-white transition-opacity hover:opacity-80" aria-label="LinkedIn">
                    <FaLinkedinIn className="h-3.5 w-3.5" />
                  </a>
                  <a href={member.facebook || "#"} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1877F2] text-white transition-opacity hover:opacity-80" aria-label="Facebook">
                    <FaFacebookF className="h-3.5 w-3.5" />
                  </a>
                  <a href={member.twitter || "#"} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#000000] text-white transition-opacity hover:opacity-80" aria-label="Twitter / X">
                    <FaXTwitter className="h-3.5 w-3.5" />
                  </a>
                  <a href={member.instagram || "#"} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E4405F] text-white transition-opacity hover:opacity-80" aria-label="Instagram">
                    <FaInstagram className="h-3.5 w-3.5" />
                  </a>
                  <a href={member.github || "#"} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#333] text-white transition-opacity hover:opacity-80" aria-label="GitHub">
                    <FaGithub className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Témoignages ═══ */}
      <section id="avis" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-brand-800">Témoignages</span>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              Ils nous font confiance
            </h2>
          </motion.div>

          {testimonials.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800"
                >
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg
                        key={j}
                        viewBox="0 0 20 20"
                        className={`h-4 w-4 ${j < (t.rating || 5) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"}`}
                      >
                        <path d="M10 15.77 16.18 19.5l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 5.23L3.82 19.5z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-800 dark:bg-brand-900/30">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.city}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800">
              <Heart className="mx-auto h-10 w-10 text-brand-800" />
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Les premiers témoignages de notre communauté arrivent bientôt.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ CTA final ═══ */}
      <section className="px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-brand-800 p-8 text-center text-white sm:p-12"
          >
            <h2 className="text-2xl font-bold sm:text-3xl">
              Rejoignez {siteName} aujourd'hui
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/80">
              Que vous soyez vendeur ou acheteur, {siteName} est la meilleure plateforme pour vos
              échanges au Togo.
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