export const mockKycStatus = {
  phoneVerified: true,
  emailVerified: true,
  identityVerified: false,
  professionalSeller: false,
  trustedSeller: true,
  documentType: null,
  documentStatus: "none",
  selfieStatus: "none",
  submittedAt: null,
  verifiedAt: null,
  rejectionReason: null,
};

export const mockVerificationSteps = [
  { id: 1, title: "Téléphone", description: "Vérifier votre numéro +228", status: "completed", icon: "Phone" },
  { id: 2, title: "Email", description: "Confirmer votre adresse email", status: "completed", icon: "Mail" },
  { id: 3, title: "Document d'identité", description: "Carte d'identité, passeport ou permis", status: "pending", icon: "FileCheck" },
  { id: 4, title: "Selfie", description: "Photo de vous avec le document", status: "pending", icon: "Camera" },
];

export const mockBadges = [
  {
    id: 1,
    name: "Téléphone vérifié",
    description: "Votre numéro de téléphone a été confirmé",
    icon: "Phone",
    color: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
    earned: true,
  },
  {
    id: 2,
    name: "Email vérifié",
    description: "Votre adresse email a été confirmée",
    icon: "Mail",
    color: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
    earned: true,
  },
  {
    id: 3,
    name: "Identité vérifiée",
    description: "Votre pièce d'identité a été validée",
    icon: "ShieldCheck",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
    earned: false,
  },
  {
    id: 4,
    name: "Vendeur professionnel",
    description: "Statut de vendeur professionnel obtenu",
    icon: "Briefcase",
    color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400",
    earned: false,
  },
  {
    id: 5,
    name: "Vendeur fiable",
    description: "Bon historique de ventes et d'avis positifs",
    icon: "Star",
    color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400",
    earned: true,
  },
  {
    id: 6,
    name: "Vendeur actif",
    description: "Plus de 10 annonces publiées ce mois",
    icon: "Zap",
    color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400",
    earned: false,
  },
];

export const mockPendingVerifications = [
  { id: 1, userId: 5, name: "Abra Povi", documentType: "CNI", submittedAt: "2025-07-20T14:30:00Z", selfieUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop", docFrontUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop" },
  { id: 2, userId: 11, name: "Adjovi Sylvie", documentType: "Permis", submittedAt: "2025-07-21T09:15:00Z", selfieUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop", docFrontUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop" },
  { id: 3, userId: 16, name: "Agoussi Pissi", documentType: "Passeport", submittedAt: "2025-07-22T11:00:00Z", selfieUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop", docFrontUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop" },
];

export default mockKycStatus;
