import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  { name: "Téléphones & Accessoires", slug: "telephones", icon: "Smartphone", color: "#3B82F6", sort_order: 1 },
  { name: "Informatique", slug: "informatique", icon: "Laptop", color: "#8B5CF6", sort_order: 2 },
  { name: "Électronique", slug: "electronique", icon: "Tv", color: "#EC4899", sort_order: 3 },
  { name: "Vêtements & Mode", slug: "vetements", icon: "Shirt", color: "#F59E0B", sort_order: 4 },
  { name: "Maison & Décoration", slug: "maison", icon: "Home", color: "#10B981", sort_order: 5 },
  { name: "Multimédia", slug: "multimedia", icon: "Gamepad2", color: "#EF4444", sort_order: 6 },
  { name: "Véhicules", slug: "vehicules", icon: "Car", color: "#6366F1", sort_order: 7 },
  { name: "Beauté & Santé", slug: "beaute", icon: "Sparkles", color: "#F472B6", sort_order: 8 },
  { name: "Sports & Loisirs", slug: "sports", icon: "Dumbbell", color: "#14B8A6", sort_order: 9 },
  { name: "Enfants & Bébé", slug: "enfants", icon: "Baby", color: "#F97316", sort_order: 10 },
  { name: "Jeux & Jouets", slug: "jouets", icon: "Blocks", color: "#A855F7", sort_order: 11 },
  { name: "Livres & Médias", slug: "livres", icon: "BookOpen", color: "#0EA5E9", sort_order: 12 },
  { name: "Instruments de musique", slug: "musique", icon: "Music", color: "#D946EF", sort_order: 13 },
  { name: "Animaux", slug: "animaux", icon: "Dog", color: "#84CC16", sort_order: 14 },
  { name: "Outillage & Bricolage", slug: "outils", icon: "Wrench", color: "#78716C", sort_order: 15 },
  { name: "Art & Artisanat", slug: "art", icon: "Palette", color: "#E11D48", sort_order: 16 },
  { name: "Jardin & Extérieur", slug: "jardin", icon: "TreePine", color: "#059669", sort_order: 17 },
  { name: "Alimentation & Boissons", slug: "alimentation", icon: "Coffee", color: "#CA8A04", sort_order: 18 },
  { name: "Immobilier", slug: "immobilier", icon: "Building", color: "#2563EB", sort_order: 19 },
  { name: "Services", slug: "services", icon: "Briefcase", color: "#7C3AED", sort_order: 20 },
  { name: "Emploi & Formation", slug: "emploi", icon: "GraduationCap", color: "#0D9488", sort_order: 21 },
  { name: "Événementiel", slug: "evenements", icon: "Calendar", color: "#DC2626", sort_order: 22 },
  { name: "Vêtements Homme", slug: "vetements-homme", icon: "User", color: "#3B82F6", sort_order: 23 },
  { name: "Vêtements Femme", slug: "vetements-femme", icon: "Heart", color: "#EC4899", sort_order: 24 },
  { name: "Chaussures", slug: "chaussures", icon: "Footprints", color: "#F59E0B", sort_order: 25 },
  { name: "Maroquinerie", slug: "maroquinerie", icon: "Wallet", color: "#92400E", sort_order: 26 },
  { name: "Montres & Bijoux", slug: "montres", icon: "Watch", color: "#D4AF37", sort_order: 27 },
  { name: "Lunettes", slug: "lunettes", icon: "Glasses", color: "#1E293B", sort_order: 28 },
  { name: "Téléphonie portable", slug: "telephonie", icon: "Smartphone", color: "#2563EB", sort_order: 29 },
  { name: "Tablettes", slug: "tablettes", icon: "Tablet", color: "#7C3AED", sort_order: 30 },
  { name: "Accessoires tech", slug: "accessoires-tech", icon: "Cable", color: "#64748B", sort_order: 31 },
  { name: "Meubles", slug: "meubles", icon: "Armchair", color: "#B45309", sort_order: 32 },
  { name: "Électroménager", slug: "electromenager", icon: "Refrigerator", color: "#0891B2", sort_order: 33 },
  { name: "Bébé & Puériculture", slug: "bebe", icon: "Heart", color: "#F472B6", sort_order: 34 },
];

const faqs = [
  { question: "Comment créer une annonce ?", answer: "Cliquez sur 'Vendre' dans le menu, remplissez le formulaire avec les détails de votre article, ajoutez des photos et publiez. C'est gratuit !", category: "annonces", sort_order: 1 },
  { question: "Comment contacter un vendeur ?", answer: "Sur la page d'une annonce, cliquez sur 'Contacter le vendeur' pour démarrer une conversation. Vous devez être connecté.", category: "annonces", sort_order: 2 },
  { question: "Les frais de commission sont-ils obligatoires ?", answer: "TG-Market prend une commission de 5% uniquement sur les transactions sécurisées (séquestre). La publication d'annonces est gratuite.", category: "paiements", sort_order: 3 },
  { question: "Comment fonctionne le paiement séquestre ?", answer: "L'acheteur paie, les fonds sont bloqués. Une fois la livraison confirmée, les fonds sont libérés au vendeur (moins 5% de commission). En cas de litige, notre équipe intervient.", category: "paiements", sort_order: 4 },
  { question: "Comment devenir vendeur vérifié ?", answer: "Passez la vérification KYC dans votre profil : vérifiez votre téléphone par OTP, puis soumettez une pièce d'identité et un selfie.", category: "compte", sort_order: 5 },
  { question: "Comment modifier mon profil ?", answer: "Allez dans Paramètres > Profil pour modifier vos informations personnelles, photo, bio et préférences.", category: "compte", sort_order: 6 },
  { question: "Comment ajouter un favori ?", answer: "Cliquez sur l'icône cœur sur n'importe quelle annonce pour l'ajouter à vos favoris. Retrouvez-les dans l'onglet Favoris.", category: "annonces", sort_order: 7 },
  { question: "Comment modifier ou supprimer une annonce ?", answer: "Dans votre tableau de bord, allez dans 'Mes annonces', cliquez sur l'annonce concernée et choisissez Modifier ou Supprimer.", category: "annonces", sort_order: 8 },
  { question: "Comment retirer mes gains ?", answer: "Allez dans Portefeuille > Retrait, choisissez votre moyen de paiement (Flooz, TMoney, Mobile Money) et entrez le montant. Le minimum est de 1 000 FCFA.", category: "paiements", sort_order: 9 },
  { question: "Comment signaler une annonce suspecte ?", answer: "Sur la page de l'annonce, cliquez sur 'Signaler' et sélectionnez le motif. Notre équipe examinera le signalement dans les 24h.", category: "securite", sort_order: 10 },
  { question: "Puis-je utiliser TG-Market en dehors du Togo ?", answer: "TG-Market est actuellement disponible uniquement au Togo. Nous prévoyons d'élargir à d'autres pays d'Afrique de l'Ouest prochainement.", category: "generale", sort_order: 11 },
  { question: "Comment contacter le support ?", answer: "Envoyez-nous un email à support@tgmarket.tg ou utilisez la page Contact. Nous répondons sous 24h.", category: "generale", sort_order: 12 },
];

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Admin user
  const adminPassword = await bcrypt.hash('Admin@TGMarket2026', 12);
  await prisma.user.upsert({
    where: { email: 'admin@tgmarket.tg' },
    update: {},
    create: {
      first_name: 'Admin',
      last_name: 'TG-Market',
      email: 'admin@tgmarket.tg',
      phone: '+22890000000',
      password: adminPassword,
      city: 'Lomé',
      role: 'admin',
      email_verified_at: new Date(),
      phone_verified_at: new Date(),
    },
  });
  console.log('✓ Admin user created');

  // 2. Categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✓ ${categories.length} categories seeded`);

  // 3. FAQs
  for (const faq of faqs) {
    await prisma.faq.create({ data: faq });
  }
  console.log(`✓ ${faqs.length} FAQs seeded`);

  console.log('🌱 Seed completed!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
