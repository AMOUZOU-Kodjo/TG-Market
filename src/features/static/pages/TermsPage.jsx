import { motion } from "framer-motion";
import { FileText, Scale, Shield, AlertTriangle, CreditCard, Users, Gavel, Mail } from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "Acceptation des conditions",
    content: `En accédant et en utilisant AK Market (ci-après "la Plateforme"), vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la Plateforme.

AK Market se réserve le droit de modifier ces conditions à tout moment. Les modifications prendront effet dès leur publication sur la Plateforme. Il est de votre responsabilité de consulter régulièrement ces conditions.`,
  },
  {
    icon: Users,
    title: "Inscription et compte",
    content: `Pour utiliser certaines fonctionnalités de la Plateforme, vous devez créer un compte. Lors de l'inscription, vous vous engagez à :

• Fournir des informations exactes, à jour et complètes
• Maintenir la confidentialité de vos identifiants de connexion
• Ne pas créer de comptes multiples
• Être âgé d'au moins 16 ans
• Ne pas usurper l'identité d'une autre personne

Vous êtes responsable de toutes les activités qui se déroulent sous votre compte. En cas d'utilisation non autorisée, vous devez nous en informer immédiatement.`,
  },
  {
    icon: Shield,
    title: "Règles de publication",
    content: `En publiant une annonce sur AK Market, vous vous engagez à :

• Décrire vos produits de manière honnête et précise
• Utiliser des photos réelles du produit concerné
• Fixer un prix juste et raisonnable
• Répondre aux demandes des acheteurs potentiels dans un délai raisonnable
• Ne pas publier de contenus offensants, discriminatoires ou illicites

Il est interdit de publier des annonces pour :
• Des produits contrefaits ou volés
• Des produits illicites (drogues, armes, etc.)
• Des services sexuels ou prostitution
• Du spam ou des publicités trompeuses
• Des produits qui enfreignent les droits de propriété intellectuelle`,
  },
  {
    icon: CreditCard,
    title: "Transactions et paiements",
    content: `AK Market facilite les rencontres entre vendeurs et acheteurs mais n'est pas partie aux transactions entre utilisateurs.

• Les prix sont fixés librement par les vendeurs
• Les paiements sont effectués directement entre les parties
• AK Market ne garantit pas la qualité, la sécurité ou la légalité des produits
• Nous recommandons vivement les rencontres en personne pour les transactions
• Le paiement sécurisé via Mobile Money sera bientôt disponible

Des frais de service de 5% s'appliquent sur les transactions effectuées via le système de paiement sécurisé d'AK Market (lorsqu'il sera disponible).`,
  },
  {
    icon: Scale,
    title: "Responsabilités",
    content: `AK Market agit en tant qu'intermédiaire technique et ne peut être tenu responsable :

• De la qualité, sécurité ou légalité des produits annoncés
• De la véracité des informations publiées par les utilisateurs
• De la capacité des vendeurs à vendre ou des acheteurs à payer
• Des dommages directs ou indirects résultant de l'utilisation de la Plateforme
• Des litiges entre utilisateurs

Les utilisateurs sont seuls responsables de leurs transactions et interactions sur la Plateforme.`,
  },
  {
    icon: AlertTriangle,
    title: "Signalements et sanctions",
    content: `AK Market se réserve le droit de :

• Supprimer tout contenu qui viole ces conditions
• Suspendre ou fermer les comptes des contrevenants
• Signaler les activités illicites aux autorités compétentes
• Modifier ou refuser une annonce sans préavis

Les sanctions possibles incluent :
• Avertissement formel
• Suspension temporaire du compte
• Suppression définitive du compte
• Signalement aux autorités pour les infractions graves`,
  },
  {
    icon: Gavel,
    title: "Propriété intellectuelle",
    content: `Le contenu d'AK Market (logo, design, texte, code) est protégé par les droits de propriété intellectuelle. Vous ne pouvez pas :

• Copier, reproduire ou distribuer le contenu de la Plateforme
• Utiliser le nom "AK Market" ou le logo sans autorisation
• Créer des applications qui imitent ou concurrencent la Plateforme
• Extraire automatiquement des données de la Plateforme

Les photos et descriptions publiées par les utilisateurs restent leur propriété, mais ils accordent à AK Market une licence non exclusive pour afficher ce contenu sur la Plateforme.`,
  },
  {
    icon: Mail,
    title: "Contact",
    content: `Pour toute question relative à ces conditions d'utilisation :

Email : legal@akmarket.tg
Téléphone : +228 90 00 00 00
Adresse : Lomé, Togo

Ces conditions sont régies par les lois de la République Togolaise. Tout litige sera soumis aux juridictions compétentes de Lomé.`,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <section className="bg-red-800 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Scale className="mx-auto mb-4 h-12 w-12 text-white/80" />
            <h1 className="text-3xl font-bold sm:text-4xl">Conditions d'utilisation</h1>
            <p className="mt-3 text-white/80">Dernière mise à jour : 15 juillet 2025</p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-red-300 bg-red-50 p-5 dark:border-red-800/20 dark:bg-red-800/5"
        >
          <p className="text-sm leading-relaxed text-red-950 dark:text-red-400">
            Ces conditions régissent votre utilisation de la plateforme AK Market.
            En utilisant nos services, vous confirmez avoir lu, compris et accepté
            l'ensemble de ces conditions.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {sections.map((section, i) => (
            <motion.section
              key={i}
              variants={itemVariants}
              className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-800/10">
                  <section.icon className="h-5 w-5 text-red-800" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              <div className="space-y-3">
                {section.content.split("\n\n").map((paragraph, j) => (
                  <p key={j} className="whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.section>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
