import { motion } from "framer-motion";
import { FileText, Scale, Shield, AlertTriangle, CreditCard, Users, Gavel, Mail, Lock, Eye, Share2, MessageSquare, Ban, CheckCircle } from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "1. Objet et opposabilité",
    content: `Les présentes CGU ont pour objet de définir les conditions d'accès et d'utilisation de l'application, des services associés (messagerie, publication d'annonces, offres, options de visibilité, logistique/livraison, moyens de paiement) et des dispositifs de sécurité.

L'utilisation de TG-Market emporte acceptation pleine et entière des CGU. La version en vigueur est celle publiée dans l'application au jour de l'utilisation. En cas de modification substantielle, TG-Market peut exiger une nouvelle acceptation (journalisée) pour continuer à utiliser les services.`,
  },
  {
    icon: Users,
    title: "2. Définitions",
    content: `Utilisateur : Toute personne disposant d'un compte TG-Market.

Vendeur / Acheteur : Utilisateur publiant ou achetant un bien ou un service.

Professionnel : Utilisateur qui agit à des fins entrant dans le cadre de son activité commerciale, industrielle, artisanale ou libérale. Il doit se déclarer comme tel et respecter les obligations légales applicables.

Annonce : Publication d'un bien par un utilisateur.

Offre : Proposition de prix formalisée via TG-Market.

Validation QR : Scan obligatoire du QR code généré lors de la remise du bien.

RDV sécurisé : Point partenaire recommandé par TG-Market.

Frais TG-Market : Frais de service et de paiement, auxquels s'ajoutent le cas échéant les frais de RDV, de livraison ou de boosts (voir barème dans l'application).

Portefeuille / Solde : Affichage des mouvements effectués lors des transactions.`,
  },
  {
    icon: Lock,
    title: "3. Conditions d'accès et de compte",
    content: `3.1 Âge et capacité : Le service est réservé aux personnes majeures. Les mineurs ne peuvent utiliser TG-Market qu'avec un accord parental formalisé pour les ventes.

3.2 Inscription : Les informations fournies doivent être exactes, complètes et à jour. Un seul compte par personne est autorisé ; les multi-comptes sont interdits.

3.3 KYC et revérification : TG-Market peut exiger une pièce d'identité (CNI, permis de conduire) accompagnée d'un selfie, ainsi que tout document complémentaire (justificatif de domicile, RCCM pour les professionnels). TG-Market peut suspendre le compte tant que la vérification n'est pas finalisée, ou le résilier en cas d'anomalie ou de faux documents.

3.4 Sécurité : L'utilisateur est tenu de protéger ses identifiants, d'activer les mesures de sécurité disponibles et de signaler immédiatement toute suspicion d'accès non autorisé à son compte.

3.5 Clôture : L'utilisateur peut demander la clôture de son compte. TG-Market peut conserver certaines données pour des motifs légaux, de lutte anti-fraude et de preuve (voir notre Politique de confidentialité).`,
  },
  {
    icon: Shield,
    title: "4. Règles de publication et catégories interdites",
    content: `4.1 Esprit « seconde main » et prix raisonnables : TG-Market privilégie les biens d'occasion, la transparence sur leur état et des prix cohérents.

4.2 Contenu de l'annonce : Les photos doivent être originales (pas d'images de catalogues), nettes et prises sous plusieurs angles. Pour l'électronique, l'écran doit être allumé et le chargeur visible. Les numéros de série doivent être apparents si requis. La description doit être honnête, mentionner les défauts et lister les accessoires inclus.

4.3 Objets interdits et sensibles (preuves exigées)

Seules les catégories visibles dans l'application TG-Market sont autorisées. Tout objet dont la catégorie est absente est interdit par principe et sera retiré. Cette liste est évolutive et non exhaustive ; TG-Market se réserve le droit de retirer tout objet présentant un risque ou contraire à la loi.

Objets strictement interdits (réfus immédiat) :
• Armes, munitions, explosifs et produits assimilés (y compris sprays au poivre, tasers, répliques d'airsoft)
• Drogues, substances dangereuses et objets associés
• Contenu pour adultes, services tendancieux et jeux d'argent
• Médicaments et parapharmacie à risque
• Cosmétiques non conformes (usagés, ouverts, périmés)
• Contrefaçons et atteintes à la propriété intellectuelle
• Espèces protégées et leurs dérivés
• Objets consignés et tout bien dont la vente est illégale

Objets sensibles autorisés sous conditions de preuves :
A. Articles de luxe / Pièces de collection : Facture d'achat, certificat d'authenticité, numéro de série et photos des marquages exigés.
B. Électronique et téléphonie : Interdiction des appareils déclarés volés/perdus ou à l'IMEI bloqué. Preuve d'achat/cession, numéro de série/IMEI et réinitialisation d'usine requis.
C. Cosmétiques et hygiène : Uniquement les produits neufs, scellés et non périmés. Photos du scellé, de la PAO, du lot et de la date de péremption requises.
D. Maison / Bricolage / Produits chimiques : Liquides, solvants, peintures et aérosols doivent être neufs, dans leur emballage d'origine scellé, avec les pictogrammes de sécurité visibles.

4.4 Modération : TG-Market peut refuser, retirer ou déréférencer toute annonce, limiter des catégories, exiger des preuves d'origine ou classer les annonces selon des critères de pertinence.

4.5 Professionnels : Leur activité est interdite sauf déclaration préalable et respect des obligations légales. TG-Market peut requalifier un compte en « professionnel » et exiger des informations supplémentaires.`,
  },
  {
    icon: MessageSquare,
    title: "5. Processus d'échange, sécurité et interdiction de contournement",
    content: `5.1 Messagerie interne : La négociation doit se faire dans TG-Market. Il est interdit d'imposer des canaux de communication externes avant qu'une offre ne soit acceptée.

5.2 Offre et acceptation : L'acceptation d'une offre fige le prix convenu et autorise, le cas échéant, l'échange de numéros de téléphone.

5.3 Validation QR obligatoire : Lors de la rencontre, l'acheteur génère un QR code dans la messagerie, que le vendeur doit scanner. Ce scan valide la transaction (horodatage, lieu, identités), sert de preuve et déclenche le paiement. À défaut, TG-Market peut considérer l'échange comme non sécurisé et appliquer des sanctions.

5.4 RDV sécurisés : TG-Market recommande des lieux partenaires. L'utilisateur demeure cependant responsable de sa sécurité et de ses biens.

5.5 Interdiction de contournement : Sont interdits :
• De conclure la vente en dehors de l'application après qu'une offre a été acceptée
• De communiquer des moyens de contact externes avant l'acceptation d'une offre
• De détourner le système de livraison ou de RDVS pour éviter les frais
• Toute manœuvre visant à éluder les frais TG-Market

TG-Market se réserve le droit d'appliquer des pénalités, des restrictions, une suspension ou une résiliation du compte.`,
  },
  {
    icon: CreditCard,
    title: "6. Paiements, prix, frais et fiscalité",
    content: `6.1 Moyens de paiement : Selon la disponibilité locale : espèces via livreur (le cas échéant), paiement via TG-Market (ex. : Wave, Orange Money, MTN MoMo), carte bancaire et autres.

6.2 Frais : Les frais sont affichés avant confirmation. Ils incluent les frais de service et de paiement, les frais de RDV, de livraison et les boosts. Le barème est publié dans l'application.

6.3 Prix et devises : Les prix sont fixés par les vendeurs. Sauf mention contraire, la devise pour le Togo est le Franc CFA (FCFA).

6.4 Comptabilité et fiscalité : Chaque utilisateur est responsable de ses obligations fiscales et déclaratives. Les professionnels doivent émettre des factures conformes.

6.5 Réserves et compensations : En cas de risque (fraude, litige, recouvrement), TG-Market peut retenir temporairement des fonds, imposer des réserves, compenser des sommes dues ou annuler un paiement.

6.A. « Portefeuille », prestataire de paiement et non-détention de fonds

6.A.1 Nature du « Portefeuille » : Toute fonctionnalité nommée « Portefeuille », « Solde » ou « Crédit » ne constitue pas un compte de paiement ni de la monnaie électronique émise par TG-Market. Il s'agit d'un affichage comptable virtuel récapitulant les mouvements traités par un prestataire de services de paiement tiers (PSP).

6.A.2 Absence de détention de fonds par TG-Market : TG-Market ne reçoit, ne détient, n'encaisse ni ne garde de fonds au nom des utilisateurs. Les flux financiers sont exclusivement traités par le PSP.

6.A.3 Statut d'TG-Market : TG-Market n'est pas un établissement de crédit, de monnaie électronique ou de paiement. TG-Market n'exerce aucune activité réglementée de services de paiement.

6.A.4 Rôle du PSP : Les autorisations, transferts, remboursements et la lutte anti-fraude relatifs aux paiements sont gérés par le PSP selon ses propres conditions.

6.A.5 Consentement et partage de données : L'utilisateur autorise TG-Market à transmettre au PSP les données nécessaires à la transaction. Des vérifications supplémentaires peuvent être requises par le PSP.

6.A.6 Absence d'intérêts et d'assurance : Aucun intérêt n'est versé sur les montants en transit. TG-Market n'assure pas les fonds.

6.A.7 Erreurs de paiement et litiges financiers : Tout incident de paiement doit être signalé immédiatement via l'application et au PSP concerné. TG-Market coopère mais n'est pas responsable des dysfonctionnements du PSP.

6.A.8 Blocages et conformité : Dans le cadre de la lutte contre la fraude et le blanchiment d'argent, le PSP et/ou TG-Market peuvent bloquer une opération, demander des justificatifs ou refuser une transaction.

6.A.9 Remboursements : Un remboursement est exécuté par le PSP via le moyen de paiement initial, lorsque cela est possible.

6.A.10 Valeur informative du solde : Le solde affiché dans l'application a une valeur informative. En cas d'écart, les registres du PSP font foi.

6.A.11 Absence de service « escrow » : TG-Market ne fournit aucun service de séquestre (escrow). Toute fonctionnalité de blocage de fonds est gérée par le PSP.

6.A.12 Disponibilité et maintenance : Les fonctionnalités de paiement peuvent être temporairement indisponibles. TG-Market n'est pas responsable des retards qui en résultent.

6.A.13 Conformité locale : Les services de paiement sont fournis sous la responsabilité du PSP agréé, en conformité avec les réglementations locales.

6.A.14 Sécurité des données de paiement : Les données de paiement sensibles sont traitées par le PSP selon les normes en vigueur (ex. : PCI DSS). TG-Market n'y a pas accès.

6.A.15 Fraude et responsabilité : La responsabilité d'TG-Market liée aux paiements se limite aux frais de service perçus pour la transaction concernée.

6.B. Tarification et barème

En contrepartie de l'utilisation du paiement sécurisé TG-Market, l'Acheteur s'acquitte de Frais de Service et de Paiement, qui s'ajoutent au prix du bien. Le montant total est indiqué avant la validation du paiement. Un montant minimum est appliqué.

Révision des tarifs : TG-Market peut ajuster le barème avec un préavis via l'application. La nouvelle grille s'applique aux offres créées après sa date d'entrée en vigueur.`,
  },
  {
    icon: Share2,
    title: "7. Livraison, remise en main propre et transfert des risques",
    content: `7.1 Livraison : Si elle est proposée, les modalités (zones, délais, coûts, responsabilité) sont affichées. Le vendeur doit emballer correctement le bien. L'acheteur doit l'inspecter à réception.

7.2 Remise en main propre / RDV sécurisés : L'acheteur doit vérifier le bien avant de valider par QR code. Le scan emporte acceptation de la conformité apparente du bien, sauf vice caché avéré.

7.3 Transfert des risques : Le transfert des risques s'effectue au moment de la remise validée par QR code ou selon les modalités de livraison indiquées.`,
  },
  {
    icon: AlertTriangle,
    title: "8. Annulations, retours et litiges",
    content: `8.1 Avant validation QR : Une annulation est possible pour des motifs légitimes (produit non conforme, absence, etc.). Les annulations répétées et sans motif peuvent être sanctionnées.

8.2 Après validation QR : La vente est en principe ferme et définitive.

8.3 Litiges : L'ouverture d'un litige doit se faire sous 24 à 48 h avec des preuves (photos, vidéos, etc.). TG-Market peut proposer une médiation mais la décision finale appartient aux parties ou à la loi.

8.4 Recouvrements (Chargebacks) et fraude : En cas de contestation de paiement, TG-Market peut bloquer les fonds, demander des preuves et débiter le vendeur si la contestation est perdue.`,
  },
  {
    icon: Scale,
    title: "9. Responsabilités et garanties",
    content: `9.1 Rôle d'TG-Market : TG-Market est un intermédiaire technique qui héberge des annonces. TG-Market n'est pas partie aux ventes et ne garantit ni l'existence ni la conformité des biens.

9.2 Responsabilité du vendeur : Le vendeur garantit être propriétaire du bien, sa licéité, sa conformité et la véracité des informations fournies.

9.3 Responsabilité de l'acheteur : L'acheteur doit examiner le bien et suivre les procédures de sécurité (RDVS, QR code).

9.4 Limitation de responsabilité : Dans les limites autorisées par la loi, la responsabilité d'TG-Market est plafonnée au montant des frais perçus sur la transaction concernée.

9.5 Force majeure et maintenance : TG-Market n'est pas responsable des pannes de réseaux externes ni des interruptions nécessaires à la maintenance.`,
  },
  {
    icon: Ban,
    title: "10. Lutte anti-fraude, sanctions et mesures",
    content: `10.1 Contrôles : TG-Market peut analyser les annonces et les comportements, et demander des preuves d'achat ou d'identité.

10.2 Sanctions graduées : Avertissement, déréférencement, retrait d'annonces, limitations, suspension, résiliation, et facturation des frais éludés.

10.3 Signalements et coopération : TG-Market peut signaler toute activité suspecte aux autorités compétentes et coopérer avec elles.`,
  },
  {
    icon: Gavel,
    title: "11. Contenus et propriété intellectuelle",
    content: `11.1 Droits d'TG-Market : Les marques, logos, designs, bases de données et logiciels sont la propriété exclusive d'TG-Market.

11.2 Licence utilisateur : En publiant du contenu, l'utilisateur concède à TG-Market une licence non exclusive, gratuite et mondiale pour l'héberger, le reproduire et le communiquer aux fins d'exploitation et de promotion de l'application.

11.3 Contrefaçon et procédure de retrait : Tout titulaire de droits peut notifier un contenu illicite à support@akmarket.tg. TG-Market appliquera la procédure de notification et de retrait appropriée.`,
  },
  {
    icon: Lock,
    title: "12. Données personnelles",
    content: `La gestion des données personnelles est régie par notre Politique de confidentialité. Elle repose sur les principes de minimisation, de sécurité et de conservation proportionnée, en conformité avec les lois applicables sur la protection des données.`,
  },
  {
    icon: CheckCircle,
    title: "13. Notations, avis et comportement",
    content: `13.1 Avis : Les avis doivent refléter une expérience réelle. Les faux avis, le chantage à l'avis, la diffamation et les propos haineux sont interdits.

13.2 Comportement : Sont interdits : le harcèlement, le spam, les menaces, la discrimination et la diffusion d'informations personnelles d'autrui (doxing).`,
  },
  {
    icon: MessageSquare,
    title: "14. Communication et preuve",
    content: `14.1 Notifications : Les communications se font via l'application, par e-mail, par SMS ou encore WhatsApp.

14.2 Preuve : Les journaux de connexion (logs), horodatages, scans QR et échanges dans la messagerie font foi entre les parties, sauf preuve contraire.

14.3 Enregistrement : TG-Market conserve les journaux d'acceptation des différentes versions des CGU.`,
  },
  {
    icon: FileText,
    title: "15. Durée, résiliation et survie",
    content: `TG-Market peut résilier ou suspendre un compte sans préavis en cas de manquement grave, de fraude ou de risque manifeste. Les clauses relatives à la responsabilité, la propriété intellectuelle, aux données et à la preuve survivent à la résiliation.`,
  },
  {
    icon: Gavel,
    title: "16. Droit applicable et juridiction",
    content: `Pour les utilisateurs au Togo, le droit applicable est le droit togolais et les tribunaux compétents sont ceux de Lomé.`,
  },
  {
    icon: FileText,
    title: "17. Dispositions diverses",
    content: `La nullité d'une clause n'affecte pas la validité des autres. L'absence de renonciation à un droit ne vaut pas renonciation pour l'avenir.`,
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
      <section className="bg-brand-800 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Scale className="mx-auto mb-4 h-12 w-12 text-white/80" />
            <h1 className="text-3xl font-bold sm:text-4xl">CGU — Conditions Générales d'Utilisation</h1>
            <p className="mt-3 text-white/80">Date de mise à jour : 10 octobre 2025</p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-brand-300 bg-brand-50 p-5 dark:border-brand-800/20 dark:bg-brand-800/5"
        >
          <p className="text-sm leading-relaxed text-brand-950 dark:text-brand-400">
            Ces conditions régissent ton utilisation de la plateforme TG-Market.
            En utilisant nos services, tu confirmes avoir lu, compris et accepté
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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-800/10">
                  <section.icon className="h-5 w-5 text-brand-800" />
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
