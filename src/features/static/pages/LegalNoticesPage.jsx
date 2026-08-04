import { motion } from "framer-motion";
import { Scale, Mail, Phone, MapPin, Building, Globe, ExternalLink } from "lucide-react";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";

const sections = [
  {
    icon: Building,
    title: "Éditeur du site",
    content: `TG-Market est édité par :

TG-Market SARU
Capital social : 5 000 000 FCFA
Registre du Commerce et du Crédit Mobilier de Lomé
Numéro d'identification fiscale : XXXXXXXXXX
Siège social : Quartier Bé, Lomé, Togo
Directeur de la publication : Kofi Mensah, CEO`,
  },
  {
    icon: Globe,
    title: "Hébergeur",
    content: `Le site TG-Market est hébergé par :

Cloudflare, Inc.
101 Townsend Street
San Francisco, CA 94107
États-Unis
https://www.cloudflare.com`,
  },
  {
    icon: Scale,
    title: "Propriété intellectuelle",
    content: `L'ensemble du contenu du site TG-Market (textes, images, graphismes, logos, icônes, sons, logiciels) est la propriété exclusive d'TG-Market SARU ou de ses partenaires et est protégé par les lois internationales relatives à la propriété intellectuelle.

Toute reproduction, représentation, modification, publication, transmission ou dénaturation du site ou de son contenu, par quelque procédé que ce soit, est interdite sans autorisation préalable écrite.

Les marques et logos reproduits sur le site sont déposés par les sociétés qui en sont propriétaires.`,
  },
  {
    icon: Mail,
    title: "Contact",
    content: `Pour toute question ou réclamation, vous pouvez nous contacter :

Email : contact@akmarket.tg
Support client : support@akmarket.tg
Téléphone : +228 90 00 00 00
Horaires : Du lundi au vendredi, de 8h à 18h (GMT+0)

Adresse postale :
TG-Market SARU
Quartier Bé, Rue de la Paix
BP 12345, Lomé
Togo`,
  },
  {
    icon: Phone,
    title: "Médiation",
    content: `En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire. À défaut, les tribunaux compétents de Lomé seront seuls compétents pour connaître du litige.

TG-Market met à disposition un service de médiation gratuit pour les litiges entre utilisateurs. Pour en bénéficier, contactez medi@akmarket.tg.`,
  },
  {
    icon: Scale,
    title: "Droit applicable",
    content: `Les présentes mentions légales sont régies par le droit de la République Togolaise. En cas de litige, les parties s'engagent à privilégier la résolution amiable des différends.

Si aucune solution amiable n'est trouvée dans un délai de 30 jours, le litige sera porté devant les juridictions compétentes de Lomé, République Togolaise.`,
  },
  {
    icon: ExternalLink,
    title: "Liens externes",
    content: `Le site TG-Market peut contenir des liens vers des sites tiers. Ces liens sont fournis uniquement pour votre commodité. TG-Market n'exerce aucun contrôle sur le contenu de ces sites tiers et décline toute responsabilité quant à leur contenu, leurs pratiques ou leurs politiques de confidentialité.

L'inclusion de liens vers des sites tiers ne signifie pas que TG-Market approuve ou recommande ces sites.`,
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

export default function LegalNoticesPage() {
  const { siteName, supportEmail } = useSiteSettings();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="bg-brand-800 px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Scale className="mx-auto mb-4 h-12 w-12 text-white/80" />
            <h1 className="text-3xl font-bold sm:text-4xl">Mentions légales</h1>
            <p className="mt-3 text-white/80">Informations légales relatives au site {siteName}</p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
              <div className="space-y-3">
                {section.content.replace(/TG-Market/g, siteName).replace(/support@akmarket\.tg/g, supportEmail).split("\n\n").map((paragraph, j) => (
                  <p key={j} className="whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.section>
          ))}
        </motion.div>

        <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
          <p>© 2025 {siteName} SARU. Tous droits réservés.</p>
          <p className="mt-1">Déclaration conformité RGPD & Loi Togolaise sur la Protection des Données Personnelles</p>
        </div>
      </div>
    </div>
  );
}
