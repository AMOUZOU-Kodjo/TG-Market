import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, HelpCircle, MessageCircle, Shield, Tag, Truck, CreditCard, UserCheck, Settings, AlertTriangle, BookOpen } from "lucide-react";
import { useFaqs } from "@/features/static/hooks/useFaqs";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";
import { Link } from "react-router-dom";
import BackButton from "@/shared/ui/BackButton";
import Button from "@/shared/ui/Button";

const categoryIcons = {
  Compte: UserCheck,
  Annonces: Tag,
  Tarifs: CreditCard,
  Communication: MessageCircle,
  Livraison: Truck,
  Sécurité: Shield,
  Paiement: CreditCard,
  Vendeur: UserCheck,
  Général: BookOpen,
  Promotion: Tag,
  Support: HelpCircle,
  Transactions: CreditCard,
};

const categoryColors = {
  Compte: "bg-brand-50 text-brand-800 dark:bg-brand-700/10 dark:text-brand-400",
  Annonces: "bg-brand-50 text-brand-800 dark:bg-brand-700/10 dark:text-brand-600",
  Tarifs: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-warning-400",
  Communication: "bg-brand-50 text-brand-800 dark:bg-brand-700/10 dark:text-brand-400",
  Livraison: "bg-brand-50 text-brand-900 dark:bg-brand-800/10 dark:text-brand-700",
  Sécurité: "bg-brand-50 text-brand-800 dark:bg-brand-700/10 dark:text-brand-400",
  Paiement: "bg-brand-50 text-brand-800 dark:bg-brand-700/10 dark:text-brand-600",
  Vendeur: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  Général: "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400",
  Promotion: "bg-brand-50 text-brand-800 dark:bg-brand-700/10 dark:text-brand-400",
  Support: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
  Transactions: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-warning-400",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function AccordionItem({ faq, isOpen, onToggle, siteName }) {
  return (
    <motion.div
      variants={itemVariants}
      className="overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
      >
        <div className={`rounded-lg p-1.5 ${categoryColors[faq.category] || "bg-gray-100 text-gray-600"}`}>
          <HelpCircle className="h-4 w-4" />
        </div>
        <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">
          {faq.question.replace(/TG-Market/g, siteName)}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-t border-gray-100 px-5 py-4 dark:border-gray-800">
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {faq.answer.replace(/TG-Market/g, siteName)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  const { data: faqs = [], isLoading } = useFaqs();
  const { siteName } = useSiteSettings();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openId, setOpenId] = useState(null);

  const categories = useMemo(() => {
    const cats = [...new Set(faqs.map((f) => f.category))];
    return ["all", ...cats];
  }, [faqs]);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      search === "" ||
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <BackButton />
      {/* Hero */}
      <section className="bg-brand-800 px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <HelpCircle className="mx-auto mb-4 h-12 w-12 text-white/80" />
              <h1 className="text-3xl font-bold sm:text-4xl">Questions fréquentes</h1>
              <p className="mt-3 text-white/80">
                Trouvez rapidement les réponses à vos questions sur {siteName}
              </p>
            </motion.div>
          </div>
        </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 shadow-sm transition-colors focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-800"
          />
        </div>

        {/* Category Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-brand-800 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              {cat === "all" ? "Toutes" : cat}
              <span className="ml-1 text-[10px] opacity-70">
                ({cat === "all" ? faqs.length : faqs.filter((f) => f.category === cat).length})
              </span>
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {filteredFaqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              siteName={siteName}
            />
          ))}
        </motion.div>

        {filteredFaqs.length === 0 && (
          <div className="py-12 text-center">
            <Search className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Aucune question trouvée pour « {search} »
            </p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 rounded-2xl border border-gray-100 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-800">
          <MessageCircle className="mx-auto mb-3 h-8 w-8 text-brand-800" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Vous n'avez pas trouvé votre réponse ?
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Notre équipe de support est disponible pour vous aider.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link to="/contact">
              <Button icon={MessageCircle}>Contactez-nous</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
