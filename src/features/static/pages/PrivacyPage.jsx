import { motion } from "framer-motion";
import { Shield, Lock, Eye, UserCheck, Database, Share2, Mail, Phone, MapPin, FileText, Clock, Globe, AlertTriangle, Cookie } from "lucide-react";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";

const sections = [
  {
    icon: Database,
    title: "1. Informations que nous recueillons",
    content: `Nous collectons différents types de informations selon ton utilisation de l'application TG-Market, afin d'assurer le bon fonctionnement du service et de t'offrir une expérience optimale.

A. Données personnelles que tu fournis directement

Données d'identification : Nom, prénom, numéro de téléphone, adresse e-mail.
Vérification de profil (KYC) : Pièces d'identité (carte nationale d'identité, permis de conduire ou passeport), selfie de vérification, registre du commerce pour les professionnels.
Contenus et échanges : Photos des annonces, descriptions, messages échangés dans la messagerie intégrée, offres et contre-offres, rendez-vous planifiés.
Données transactionnelles : Historique des transactions, montants, récapitulatifs des frais (service, paiement, livraison), validations par QR code (incluant horodatage, lieu et identifiants des parties).
Données de connexion : Identifiants de connexion (hachés), adresses IP, journaux d'accès et informations sur les appareils utilisés.

B. Données collectées indirectement

Traceurs techniques : Identifiants d'appareil et journaux de connexion nécessaires au fonctionnement et à la sécurité de l'application (note : il n'y a pas de cookies sur l'application mobile ; seuls des cookies essentiels peuvent être utilisés sur notre site web).
Données de prestataires : Informations limitées provenant de nos prestataires d'hébergement et de stockage, ainsi que de nos prestataires de paiement, exclusivement pour exécuter ou valider une opération.

Précision concernant le « Portefeuille » : L'affichage du « Portefeuille » ou du « Solde » dans l'application est purement informatif. TG-Market ne détient jamais tes fonds et n'exécute aucune transaction financière. Les flux sont gérés exclusivement par les prestataires de paiement.`,
  },
  {
    icon: Eye,
    title: "2. Utilisation de tes données",
    content: `Gestion du compte et exécution du contrat : Création de profil, publication d'annonces, messagerie, gestion des offres, validation par QR code, organisation de RDV sécurisés, et gestion de la livraison ou des retours lorsqu'ils sont proposés.

Vérification et sécurité : Procédures KYC, prévention de la fraude, du recel et des contournements, modération des contenus et journalisation technique.

Amélioration du service : Analyses agrégées, statistiques d'usage, suivi de la qualité et support utilisateur.

Communications : Envoi de notifications de service essentielles au fonctionnement de l'application. Les communications commerciales ne sont envoyées qu'avec ton consentement explicite (opt-in).

Obligations légales : Réponse aux demandes des autorités, respect des durées de conservation légales, et participation à la lutte contre le blanchiment d'argent et le financement du terrorisme (AML/CFT) via nos PSP.`,
  },
  {
    icon: Share2,
    title: "3. Partage de tes données",
    content: `Nos prestataires : Hébergement, stockage, prestataires de paiement, services de vérification d'identité et outils de support ou de lutte anti-fraude. Ce partage est limité à ce qui est contractuellement nécessaire et est encadré par des accords de traitement de données (DPA) ou des clauses contractuelles appropriées.

Autorités publiques et judiciaires : Uniquement sur réquisition légale.

Autres utilisateurs : Uniquement les informations minimales nécessaires à la réalisation d'une transaction en fonction des actions que tu réalises dans l'application.`,
  },
  {
    icon: Clock,
    title: "4. Durées de conservation",
    content: `Données de vérification de profil (KYC) : La pièce d'identité et le selfie sont conservés 14 jours après la vérification, sauf obligation légale contraire, gestion d'un litige ou prévention de la fraude, auquel cas la conservation est limitée au strict nécessaire.

Données de transaction : Conservées pendant toute la durée d'utilisation de nos services. Si des obligations comptables ou fiscales s'appliquent, elles sont archivées pour la durée légale applicable.

Autres données personnelles : Conservées tant que ton compte est actif. Elles sont ensuite supprimées ou anonymisées dans un délai de 12 mois après la désactivation de ton compte, sauf obligation légale ou nécessité pour la défense de nos droits.

Journaux de connexion et de sécurité : Conservés pour une durée maximale de 12 mois, sauf en cas d'incident de sécurité où ils sont conservés le temps nécessaire à la résolution de l'incident.`,
  },
  {
    icon: UserCheck,
    title: "5. Tes droits",
    content: `Conformément à la réglementation en vigueur, tu disposes des droits suivants : accès, rectification, effacement, opposition, limitation du traitement, portabilité de tes données et retrait de ton consentement (sans que cela n'affecte la licéité des traitements antérieurs).

Pour exercer tes droits, contacte-nous à support@akmarket.tg. Tu peux également déposer une réclamation auprès de l'autorité de protection des données compétente dans ton pays de résidence.`,
  },
  {
    icon: Lock,
    title: "6. Sécurité des données",
    content: `Nous mettons en œuvre des mesures techniques et organizationnelles pour protéger tes données : chiffrement des données en transit et au repos, contrôles d'accès stricts, journalisation des activités, revue des permissions, segmentation des environnements, sauvegardes régulières et politique de mots de passe renforcée. Les données de paiement sensibles sont traitées directement par nos prestataires conformes aux normes de sécurité (ex. : PCI DSS).`,
  },
  {
    icon: Globe,
    title: "7. Transferts internationaux",
    content: `Nos prestataires peuvent être situés en dehors du Togo. Tout transfert de données en dehors de ton territoire est encadré par des garanties adéquates.`,
  },
  {
    icon: Cookie,
    title: "8. Cookies et traceurs",
    content: `Application mobile : Nous n'utilisons pas de cookies, mais des identifiants techniques d'appareil et des journaux essentiels à son fonctionnement peuvent être collectés.

Site web : Nous utilisons actuellement des cookies essentiels (sécurité, gestion de session).`,
  },
  {
    icon: Shield,
    title: "9. Modifications",
    content: `Cette politique de confidentialité peut évoluer. En cas de changement significatif, nous t'en informerons via l'application et/ou par e-mail, et nous solliciterons un nouveau consentement si la loi l'exige.`,
  },
  {
    icon: Mail,
    title: "10. Contact",
    content: `Pour toute question relative à cette politique ou à la gestion de tes données, contacte-nous à l'adresse suivante : support@akmarket.tg.

Un délégué à la protection des données (DPO) ou un point de contact spécifique pourra être désigné et ses coordonnées seront communiquées dans l'application.`,
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
  const { siteName, supportEmail } = useSiteSettings();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="bg-brand-800 px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Shield className="mx-auto mb-4 h-12 w-12 text-white/80" />
            <h1 className="text-3xl font-bold sm:text-4xl">Politique de confidentialité et Cookies</h1>
            <p className="mt-3 text-white/80">
              Date de mise à jour : 10 octobre 2025
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-brand-300 bg-brand-50 p-5 dark:border-brand-800/20 dark:bg-brand-800/5"
        >
          <p className="text-sm leading-relaxed text-brand-950 dark:text-brand-400">
            Cette politique explique comment nous recueillons, utilisons, conservons et partageons tes données lorsque tu utilises nos services {siteName}.
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
              className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-800/10">
                  <section.icon className="h-5 w-5 text-brand-800" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              <div className="prose prose-sm max-w-none">
                {section.content.replace(/TG-Market/g, siteName).replace(/support@akmarket\.tg/g, supportEmail).split("\n\n").map((paragraph, j) => (
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
