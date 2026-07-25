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
} from "lucide-react";
import Button from "@/shared/ui/Button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

const stats = [
  { value: "24 000+", label: "Utilisateurs actifs", icon: Users },
  { value: "18 000+", label: "Annonces publiÃ©es", icon: TrendingUp },
  { value: "5 600+", label: "Ventes rÃ©alisÃ©es", icon: Star },
  { value: "30+", label: "Villes couvertes", icon: MapPin },
];

const values = [
  {
    icon: Shield,
    title: "Confiance & SÃ©curitÃ©",
    description: "Chaque transaction est protÃ©gÃ©e. Nous vÃ©rifions les profils et encourageons les rencontres en personne pour des Ã©changes en toute sÃ©rÃ©nitÃ©.",
  },
  {
    icon: Heart,
    title: "CommunautÃ© Togolaise",
    description: "AK Market est nÃ© au Togo, pour le Togo. Notre plateforme est conÃ§ue pour rÃ©pondre aux besoins spÃ©cifiques des Togolais.",
  },
  {
    icon: Handshake,
    title: "Commerce Juste",
    description: "Nous croyons en un commerce Ã©quitable qui profite Ã  tous. Pas de frais cachÃ©s, pas de commissions abusives.",
  },
  {
    icon: Sparkles,
    title: "Innovation Locale",
    description: "Paiement mobile, livraison locale, support en franÃ§ais. Tout est pensÃ© pour faciliter vos Ã©changes quotidiens.",
  },
];

const teamMembers = [
  { name: "Kofi Mensah", role: "CEO & Co-fondateur", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&facepad=2" },
  { name: "Ama Kossi", role: "CTO & Co-fondatrice", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&facepad=2" },
  { name: "Yao AgbÃ©kÃ©", role: "Directeur Marketing", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&facepad=2" },
  { name: "Efua Tossou", role: "Chef de Produit", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&facepad=2" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-red-800 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/10" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
              La marketplace du{" "}
              <span className="text-yellow-500">Togo</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
              AK Market connecte les vendeurs et acheteurs Ã  travers tout le Togo.
              Achetez, vendez et Ã©changez en toute confiance.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/">
              <Button size="lg" className="bg-white text-red-900 hover:bg-gray-100">
                Explorer AK Market
                <ArrowRight className="ml-1 h-5 w-5" />
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

      {/* Stats */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4 lg:grid-cols-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="rounded-2xl border border-gray-100 bg-white p-5 text-center dark:border-gray-800 dark:bg-gray-900"
              >
                <stat.icon className="mx-auto mb-2 h-6 w-6 text-red-800" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-900/50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Notre mission</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Rendre le commerce accessible Ã  tous les Togolais. Que vous soyez Ã  LomÃ©, Kara, SokodÃ© ou KpalimÃ©,
              AK Market vous permet de vendre et acheter en toute simplicitÃ©.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
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
                className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 dark:bg-red-800/10">
                  <value.icon className="h-6 w-6 text-red-800" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-900/50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Notre Ã©quipe</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Des passionnÃ©s au service du digital togolais
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6 lg:grid-cols-4"
          >
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="rounded-2xl border border-gray-100 bg-white p-5 text-center dark:border-gray-800 dark:bg-gray-900"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="mx-auto h-20 w-20 rounded-full object-cover ring-4 ring-red-50 dark:ring-gray-800"
                />
                <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="mt-0.5 text-xs text-red-800">{member.role}</p>
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
            className="rounded-2xl bg-red-800 p-8 text-center text-white sm:p-12"
          >
            <h2 className="text-2xl font-bold sm:text-3xl">
              Rejoignez AK Market aujourd'hui
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/80">
              Que vous soyez vendeur ou acheteur, AK Market est la meilleure
              plateforme pour vos Ã©changes au Togo.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/inscription">
                <Button size="lg" className="bg-white text-red-900 hover:bg-gray-100">
                  CrÃ©er un compte gratuit
                </Button>
              </Link>
              <Link to="/vendre">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Commencer Ã  vendre
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
