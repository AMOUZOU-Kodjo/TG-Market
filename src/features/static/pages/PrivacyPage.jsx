import { motion } from "framer-motion";
import { Shield, Lock, Eye, UserCheck, Database, Share2, Mail, Phone, MapPin } from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "Collecte des informations",
    content: `Nous collectons les informations que vous nous fournissez directement lors de votre inscription ou de l'utilisation de nos services. Ces informations incluent :

• Votre nom, adresse email et numéro de téléphone
• Votre photo de profil et vos préférences
• Les informations relatives à vos annonces (description, prix, photos, localisation)
• Les données de transaction (achats, ventes, paiements)
• Les données de navigation (pages visitées, recherches effectuées)
• Les informations de votre appareil (type, système d'exploitation, adresse IP)`,
  },
  {
    icon: Eye,
    title: "Utilisation des informations",
    content: `Nous utilisons vos informations pour :

• Fournir, maintenir et améliorer nos services
• Faciliter les transactions entre vendeurs et acheteurs
• Vous envoyer des notifications pertinentes concernant vos annonces et transactions
• Personnaliser votre expérience utilisateur
• Prévenir la fraude et assurer la sécurité de la plateforme
• Communiquer avec vous concernant votre compte et nos services
• Respecter nos obligations légales`,
  },
  {
    icon: Share2,
    title: "Partage des informations",
    content: `Nous ne vendons pas vos informations personnelles à des tiers. Nous pouvons partager vos informations dans les cas suivants :

• Avec les autres utilisateurs : votre nom et photo de profil sont visibles sur vos annonces
• Avec les vendeurs/acheteurs : les coordonnées sont partagées uniquement après un accord de transaction
• Avec nos prestataires de services : hébergement, paiement, livraison
• Pour des raisons légales : en réponse à une demande judiciaire ou pour protéger nos droits`,
  },
  {
    icon: Lock,
    title: "Sécurité des données",
    content: `Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données :

• Chiffrement SSL/TLS pour toutes les communications
• Authentification sécurisée et gestion des mots de passe
• Surveillance continue des activités suspectes
• Accès limité aux données personnelles par notre personnel
• Sauvegardes régulières et plan de reprise d'activité
• Conformité aux normes de sécurité internationales`,
  },
  {
    icon: UserCheck,
    title: "Vos droits",
    content: `Conformément à la réglementation en vigueur, vous disposez des droits suivants :

• Droit d'accès : obtenir une copie de vos données personnelles
• Droit de rectification : corriger les informations inexactes
• Droit à l'effacement : demander la suppression de vos données
• Droit à la portabilité : recevoir vos données dans un format structuré
• Droit d'opposition : vous opposer au traitement de vos données
• Droit de limitation : demander la limitation du traitement

Pour exercer ces droits, contactez-nous à privacy@akmarket.tg.`,
  },
  {
    icon: Mail,
    title: "Conservation des données",
    content: `Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales.

• Données de compte : conservées tant que votre compte est actif
• Données de transaction : conservées pendant 5 ans conformément à la législation fiscale
• Données de navigation : conservées pendant 12 mois
• Données supprimées : effacées définitivement dans un délai de 30 jours`,
  },
  {
    icon: Phone,
    title: "Cookies et technologies similaires",
    content: `Nous utilisons des cookies et technologies similaires pour :

• Assurer le bon fonctionnement de la plateforme
• Mémoriser vos préférences et paramètres
• Analyser l'utilisation de nos services pour les améliorer
• Vous proposer des contenus et publicités pertinents

Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.`,
  },
  {
    icon: MapPin,
    title: "Contact",
    content: `Pour toute question relative à cette politique de confidentialité ou à la protection de vos données, vous pouvez nous contacter :

Email : privacy@akmarket.tg
Téléphone : +228 90 00 00 00
Adresse : Lomé, Togo
Délégué à la protection des données : dpo@akmarket.tg`,
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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <section className="bg-red-800 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Shield className="mx-auto mb-4 h-12 w-12 text-white/80" />
            <h1 className="text-3xl font-bold sm:text-4xl">Politique de confidentialité</h1>
            <p className="mt-3 text-white/80">
              Dernière mise à jour : 15 juillet 2025
            </p>
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
            Chez AK Market, la protection de vos données personnelles est une priorité.
            Cette politique de confidentialité décrit comment nous collectons, utilisons
            et protégeons vos informations lorsque vous utilisez notre plateforme.
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
              <div className="prose prose-sm max-w-none">
                {section.content.split("\n\n").map((paragraph, j) => (
                  <p key={j} className="mb-3 whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-gray-400">
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
