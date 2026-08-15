import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Smartphone,
  ScanLine,
  BadgeCheck,
  Handshake,
  MapPin,
  Truck,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Eye,
  CreditCard,
  KeyRound,
} from "lucide-react";
import Button from "@/shared/ui/Button";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";

const guarantees = [
  {
    icon: Lock,
    title: "Paiement séquestre",
    description:
      "L'argent est bloqué en toute sécurité jusqu'à ce que vous confirmiez avoir reçu l'article. Le vendeur n'est payé qu'après votre validation.",
    color: "bg-emerald-50 dark:bg-emerald-900/20",
    iconColor: "text-emerald-600",
  },
  {
    icon: Smartphone,
    title: "Paiement mobile",
    description:
      "Flooz, T-Money et Mobile Money : payez sans carte bancaire, directement depuis votre téléphone, partout au Togo.",
    color: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600",
  },
  {
    icon: BadgeCheck,
    title: "Vendeurs vérifiés",
    description:
      "Chaque vendeur doit vérifier son identité (KYC) avant de vendre. Les badges attestent des profils fiables et professionnels.",
    color: "bg-amber-50 dark:bg-amber-900/20",
    iconColor: "text-amber-600",
  },
  {
    icon: ScanLine,
    title: "Code de confirmation",
    description:
      "À la livraison, un code secret à 4 chiffres valide la transaction. Sans ce code, le vendeur ne reçoit jamais l'argent.",
    color: "bg-violet-50 dark:bg-violet-900/20",
    iconColor: "text-violet-600",
  },
  {
    icon: MapPin,
    title: "Points de rencontre",
    description:
      "Retrouvez-vous dans les lieux partenaires sécurisés à Lomé, Kara et dans les grandes villes du Togo.",
    color: "bg-rose-50 dark:bg-rose-900/20",
    iconColor: "text-rose-600",
  },
  {
    icon: Eye,
    title: "Modération active",
    description:
      "Nos équipes vérifient les annonces et les comptes 24h/24. Les signalements sont traités rapidement pour protéger la communauté.",
    color: "bg-cyan-50 dark:bg-cyan-900/20",
    iconColor: "text-cyan-600",
  },
];

const buyerSteps = [
  {
    step: "01",
    title: "Vous trouvez l'article",
    description:
      "Parcourez les annonces vérifiées et discutez directement avec le vendeur via la messagerie intégrée.",
  },
  {
    step: "02",
    title: "Vous payez en sécurité",
    description:
      "L'argent est placé dans le séquestre. Le vendeur est informé, il prépare l'envoi ou la remise.",
  },
  {
    step: "03",
    title: "Vous recevez et validez",
    description:
      "À la réception, scannez le code QR ou communiquez le code de confirmation. Vous êtes protégé à 100%.",
  },
];

const sellerSteps = [
  {
    step: "01",
    title: "Vérification d'identité",
    description:
      "Passez la vérification KYC pour devenir vendeur certifié et gagner la confiance des acheteurs.",
  },
  {
    step: "02",
    title: "Vente sécurisée",
    description:
      "La vente est protégée par le séquestre : aucun risque de non-paiement après remise de l'article.",
  },
  {
    step: "03",
    title: "Paiement garanti",
    description:
      "Dès que l'acheteur confirme la réception, le montant est crédité sur votre portefeuille. Simple et prévisible.",
  },
];

const safetyTips = [
  {
    icon: Handshake,
    title: "Rencontrez-vous dans un lieu public",
    description:
      "Privilégiez les points de rencontre partenaires, en journée, et ne donnez jamais votre code de confirmation par message avant la remise effective de l'article.",
  },
  {
    icon: CreditCard,
    title: "Payez uniquement via le séquestre",
    description:
      "Ne versez jamais d'acompte en direct, ni sur un compte « bancaire » de fortune. Toute demande de paiement hors plateforme est une arnaque.",
  },
  {
    icon: MessageCircle,
    title: "Restez sur notre messagerie",
    description:
      "Concluez vos échanges dans le chat intégré : nos équipes peuvent consulter les conversations en cas de litige et protéger vos droits.",
  },
  {
    icon: KeyRound,
    title: "Protégez votre compte",
    description:
      "Utilisez un mot de passe fort et activez la double authentification (2FA). Ne partagez jamais vos codes de récupération.",
  },
  {
    icon: AlertTriangle,
    title: "Vérifiez avant de payer",
    description:
      "Comparez le prix avec le marché, demandez des photos supplémentaires et méfiez-vous des offres trop belles pour être vraies.",
  },
  {
    icon: Truck,
    title: "Contrôlez à la réception",
    description:
      "Vérifiez l'article avant de confirmer la réception. Une fois le code validé, le paiement est libéré définitivement au vendeur.",
  },
];

const faqs = [
  {
    q: "Comment fonctionne le paiement séquestre ?",
    a: "L'acheteur paie le montant de la transaction, qui est bloqué sur la plateforme. L'argent n'est libéré au vendeur qu'après que l'acheteur a confirmé avoir reçu l'article en bon état, via un code de confirmation à 4 chiffres.",
  },
  {
    q: "Est-ce que je peux être remboursé ?",
    a: "Oui. En cas d'ouverture de litige, notre équipe examine la situation. Si l'article n'est pas livré ou ne correspond pas à la description, l'acheteur est intégralement remboursé après validation du litige en sa faveur.",
  },
  {
    q: "Comment savoir si un vendeur est fiable ?",
    a: "Vérifiez les badges sur le profil : « Identité vérifiée », « Vendeur professionnel » et « Vendeur de confiance » sont attribués après contrôle. Consultez aussi les avis et l'historique du vendeur avant de finaliser.",
  },
  {
    q: "Que faire en cas d'arnaque ?",
    a: "Signalez immédiatement l'annonce ou le profil via le bouton « Signaler ». Notre équipe de modération agit rapidement : blocage du compte fautif et ouverture d'une enquête, avec remboursement des victimes sur le séquestre.",
  },
  {
    q: "Comment recevoir mon argent en tant que vendeur ?",
    a: "Dès la confirmation de livraison par l'acheteur, le montant (frais de service déduits) est crédité sur votre portefeuille. Vous pouvez ensuite demander un retrait vers votre numéro Flooz ou T-Money enregistré.",
  },
];

export default function SafetyPage() {
  const navigate = useNavigate();
  const { siteName } = useSiteSettings();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-800 px-4 py-20 text-white sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-emerald-400 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-yellow-400 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300 ring-1 ring-emerald-400/40">
              <ShieldCheck className="h-4 w-4" />
              Votre sécurité avant tout
            </span>
            <h1 className="text-4xl font-bold sm:text-5xl">
              Achetez et vendez en toute <span className="text-yellow-400">confiance</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
              {siteName} protège chaque transaction : paiement séquestre, identité vérifiée et code de
              confirmation. Zéro risque, zéro arnaque.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/comment-ca-marche">
                <Button size="lg" icon={ArrowRight} iconPosition="right" className="bg-white text-brand-900 hover:bg-gray-100">
                  Comment ça marche
                </Button>
              </Link>
              <Link to="/connexion">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Créer un compte gratuit
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Garanties */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <span className="text-sm font-bold uppercase tracking-widest text-brand-800">
              Nos garanties
            </span>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              6 protections sur chaque transaction
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-600 dark:text-gray-400">
              De la mise en ligne de l'annonce jusqu'à la confirmation de livraison, chaque étape est sécurisée.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guarantees.map((g, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-gray-100 bg-white p-6 transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-800"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${g.color}`}>
                  <g.icon className={`h-6 w-6 ${g.iconColor}`} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{g.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {g.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Parcours sécurisé */}
      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-800/50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <span className="text-sm font-bold uppercase tracking-widest text-brand-800">
              Comment c'est protégé
            </span>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              Le parcours sécurisé, pas à pas
            </h2>
          </motion.div>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Acheteur */}
            <div className="rounded-2xl border border-gray-100 bg-white p-8 dark:border-gray-800 dark:bg-gray-800">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/20">
                  <Handshake className="h-5 w-5 text-brand-800" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Côté acheteur</h3>
              </div>
              <div className="space-y-6">
                {buyerSteps.map((s, i) => (
                  <div key={i} className="relative flex gap-4">
                    {i < buyerSteps.length - 1 && (
                      <div className="absolute left-5 top-11 h-[calc(100%-2.5rem)] w-px bg-gray-200 dark:bg-gray-700" />
                    )}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-800 text-xs font-bold text-white">
                      {s.step}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{s.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {s.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vendeur */}
            <div className="rounded-2xl border border-gray-100 bg-white p-8 dark:border-gray-800 dark:bg-gray-800">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                  <BadgeCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Côté vendeur</h3>
              </div>
              <div className="space-y-6">
                {sellerSteps.map((s, i) => (
                  <div key={i} className="relative flex gap-4">
                    {i < sellerSteps.length - 1 && (
                      <div className="absolute left-5 top-11 h-[calc(100%-2.5rem)] w-px bg-gray-200 dark:bg-gray-700" />
                    )}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                      {s.step}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{s.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {s.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conseils anti-arnaque */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <span className="text-sm font-bold uppercase tracking-widest text-brand-800">
              Bonnes pratiques
            </span>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              Les réflexes anti-arnaque
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-600 dark:text-gray-400">
              Quelques règles simples pour des échanges sereins, entre Togolais.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {safetyTips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-900/20">
                  <tip.icon className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{tip.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {tip.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sécurité */}
      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-800/50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <span className="text-sm font-bold uppercase tracking-widest text-brand-800">
              Questions fréquentes
            </span>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              Sécurité : vos questions
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className="flex items-center gap-3 text-sm font-semibold text-gray-900 dark:text-white">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
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
            <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-yellow-400" />
            <h2 className="text-2xl font-bold sm:text-3xl">
              Rejoignez une communauté qui protège ses membres
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/80">
              Chaque transaction sur {siteName} est couverte. Créez votre compte gratuit et achetez,
              vendez en toute tranquillité.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/inscription">
                <Button size="lg" className="bg-white text-brand-900 hover:bg-gray-100">
                  Créer un compte gratuit
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Contacter le support
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}