// import 'dotenv/config';
// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcryptjs';

// const prisma = new PrismaClient();

// // Mega-catégories (parents)
// const megaCategories = [
//   { name: "Multimédia", slug: "multimedia", icon: "Smartphone", color: "#3B82F6", sort_order: 1 },
//   { name: "Véhicules", slug: "vehicules", icon: "Car", color: "#6366F1", sort_order: 2 },
//   { name: "Maison", slug: "maison", icon: "Home", color: "#10B981", sort_order: 3 },
//   { name: "Mode & Beauté", slug: "mode", icon: "Shirt", color: "#F59E0B", sort_order: 4 },
//   { name: "Loisirs", slug: "loisirs", icon: "Gamepad2", color: "#EF4444", sort_order: 5 },
//   { name: "Famille", slug: "famille", icon: "Baby", color: "#F97316", sort_order: 6 },
//   { name: "Bricolage & Jardin", slug: "bricolage-jardin", icon: "Wrench", color: "#78716C", sort_order: 7 },
//   { name: "Immobilier", slug: "immobilier", icon: "Building", color: "#2563EB", sort_order: 8 },
//   { name: "Pro & Services", slug: "pro-services", icon: "Briefcase", color: "#7C3AED", sort_order: 9 },
// ];

// // Sous-catégories (enfants) liées à leur parent par slug
// const subCategories = [
//   // ── Multimédia ──
//   { name: "Téléphones & Accessoires", slug: "telephones", icon: "Smartphone", color: "#2563EB", sort_order: 1, parentSlug: "multimedia" },
//   { name: "Téléphonie portable", slug: "telephonie", icon: "Smartphone", color: "#1D4ED8", sort_order: 2, parentSlug: "multimedia" },
//   { name: "Informatique", slug: "informatique", icon: "Laptop", color: "#8B5CF6", sort_order: 3, parentSlug: "multimedia" },
//   { name: "Tablettes", slug: "tablettes", icon: "Tablet", color: "#7C3AED", sort_order: 4, parentSlug: "multimedia" },
//   { name: "Électronique", slug: "electronique", icon: "Tv", color: "#EC4899", sort_order: 5, parentSlug: "multimedia" },
//   { name: "Accessoires tech", slug: "accessoires-tech", icon: "Cable", color: "#64748B", sort_order: 6, parentSlug: "multimedia" },
//   { name: "Appareils Photo & Vidéo", slug: "photo-video", icon: "Camera", color: "#D946EF", sort_order: 7, parentSlug: "multimedia" },
//   { name: "Lunettes", slug: "lunettes", icon: "Glasses", color: "#1E293B", sort_order: 8, parentSlug: "multimedia" },

//   // ── Véhicules ──
//   { name: "Voitures", slug: "voitures", icon: "Car", color: "#2563EB", sort_order: 1, parentSlug: "vehicules" },
//   { name: "Motos & Scooters", slug: "motos", icon: "Bike", color: "#F97316", sort_order: 2, parentSlug: "vehicules" },
//   { name: "Vélos", slug: "velos", icon: "Bike", color: "#10B981", sort_order: 3, parentSlug: "vehicules" },

//   // ── Maison ──
//   { name: "Maison & Décoration", slug: "maison-decoration", icon: "Home", color: "#059669", sort_order: 1, parentSlug: "maison" },
//   { name: "Meubles", slug: "meubles", icon: "Sofa", color: "#B45309", sort_order: 2, parentSlug: "maison" },
//   { name: "Électroménager", slug: "electromenager", icon: "Refrigerator", color: "#0891B2", sort_order: 3, parentSlug: "maison" },

//   // ── Mode & Beauté ──
//   { name: "Vêtements & Mode", slug: "vetements", icon: "Shirt", color: "#F59E0B", sort_order: 1, parentSlug: "mode" },
//   { name: "Vêtements Homme", slug: "vetements-homme", icon: "User", color: "#3B82F6", sort_order: 2, parentSlug: "mode" },
//   { name: "Vêtements Femme", slug: "vetements-femme", icon: "Heart", color: "#EC4899", sort_order: 3, parentSlug: "mode" },
//   { name: "Chaussures", slug: "chaussures", icon: "Footprints", color: "#F59E0B", sort_order: 4, parentSlug: "mode" },
//   { name: "Maroquinerie & Sacs", slug: "maroquinerie", icon: "BaggageClaim", color: "#92400E", sort_order: 5, parentSlug: "mode" },
//   { name: "Montres & Bijoux", slug: "montres", icon: "Watch", color: "#D4AF37", sort_order: 6, parentSlug: "mode" },
//   { name: "Beauté & Santé", slug: "beaute", icon: "Sparkles", color: "#F472B6", sort_order: 7, parentSlug: "mode" },

//   // ── Loisirs ──
//   { name: "Sports & Loisirs", slug: "sports", icon: "Dumbbell", color: "#14B8A6", sort_order: 1, parentSlug: "loisirs" },
//   { name: "Jeux & Jouets", slug: "jouets", icon: "Gamepad2", color: "#A855F7", sort_order: 2, parentSlug: "loisirs" },
//   { name: "Livres & Médias", slug: "livres", icon: "BookOpen", color: "#0EA5E9", sort_order: 3, parentSlug: "loisirs" },
//   { name: "Instruments de musique", slug: "musique", icon: "Music", color: "#D946EF", sort_order: 4, parentSlug: "loisirs" },
//   { name: "Art & Artisanat", slug: "art", icon: "Palette", color: "#E11D48", sort_order: 5, parentSlug: "loisirs" },

//   // ── Famille ──
//   { name: "Enfants & Bébé", slug: "enfants", icon: "Baby", color: "#F97316", sort_order: 1, parentSlug: "famille" },
//   { name: "Bébé & Puériculture", slug: "bebe", icon: "Heart", color: "#F472B6", sort_order: 2, parentSlug: "famille" },
//   { name: "Animaux", slug: "animaux", icon: "PawPrint", color: "#84CC16", sort_order: 3, parentSlug: "famille" },

//   // ── Bricolage & Jardin ──
//   { name: "Outillage & Bricolage", slug: "outils", icon: "Wrench", color: "#78716C", sort_order: 1, parentSlug: "bricolage-jardin" },
//   { name: "Jardin & Extérieur", slug: "jardin", icon: "TreePine", color: "#059669", sort_order: 2, parentSlug: "bricolage-jardin" },
//   { name: "Énergie & Solaire", slug: "energie-solaire", icon: "Sun", color: "#CA8A04", sort_order: 3, parentSlug: "bricolage-jardin" },

//   // ── Immobilier ──
//   { name: "Appartements & Maisons", slug: "appartements", icon: "Building", color: "#2563EB", sort_order: 1, parentSlug: "immobilier" },
//   { name: "Terrains", slug: "terrains", icon: "TreePine", color: "#059669", sort_order: 2, parentSlug: "immobilier" },
//   { name: "Bureaux & Commerces", slug: "bureaux", icon: "Building2", color: "#6366F1", sort_order: 3, parentSlug: "immobilier" },

//   // ── Pro & Services ──
//   { name: "Services", slug: "services", icon: "Briefcase", color: "#7C3AED", sort_order: 1, parentSlug: "pro-services" },
//   { name: "Emploi & Formation", slug: "emploi", icon: "GraduationCap", color: "#0D9488", sort_order: 2, parentSlug: "pro-services" },
//   { name: "Équipement Professionnel", slug: "equipement-pro", icon: "Briefcase", color: "#475569", sort_order: 3, parentSlug: "pro-services" },
//   { name: "Alimentation & Boissons", slug: "alimentation", icon: "Coffee", color: "#CA8A04", sort_order: 4, parentSlug: "pro-services" },
//   { name: "Événementiel", slug: "evenements", icon: "Calendar", color: "#DC2626", sort_order: 5, parentSlug: "pro-services" },
//   { name: "Divers", slug: "divers", icon: "Package", color: "#6B7280", sort_order: 6, parentSlug: "pro-services" },
// ];

// const faqs = [
//   { question: "Comment créer une annonce ?", answer: "Cliquez sur 'Vendre' dans le menu, remplissez le formulaire avec les détails de votre article, ajoutez des photos et publiez. C'est gratuit !", category: "annonces", sort_order: 1 },
//   { question: "Comment contacter un vendeur ?", answer: "Sur la page d'une annonce, cliquez sur 'Contacter le vendeur' pour démarrer une conversation. Vous devez être connecté.", category: "annonces", sort_order: 2 },
//   { question: "Les frais de commission sont-ils obligatoires ?", answer: "TG-Market prend une commission de 5% uniquement sur les transactions sécurisées (séquestre). La publication d'annonces est gratuite.", category: "paiements", sort_order: 3 },
//   { question: "Comment fonctionne le paiement séquestre ?", answer: "L'acheteur paie, les fonds sont bloqués. Une fois la livraison confirmée, les fonds sont libérés au vendeur (moins 5% de commission). En cas de litige, notre équipe intervient.", category: "paiements", sort_order: 4 },
//   { question: "Comment devenir vendeur vérifié ?", answer: "Passez la vérification KYC dans votre profil : vérifiez votre téléphone par OTP, puis soumettez une pièce d'identité et un selfie.", category: "compte", sort_order: 5 },
//   { question: "Comment modifier mon profil ?", answer: "Allez dans Paramètres > Profil pour modifier vos informations personnelles, photo, bio et préférences.", category: "compte", sort_order: 6 },
//   { question: "Comment ajouter un favori ?", answer: "Cliquez sur l'icône cœur sur n'importe quelle annonce pour l'ajouter à vos favoris. Retrouvez-les dans l'onglet Favoris.", category: "annonces", sort_order: 7 },
//   { question: "Comment modifier ou supprimer une annonce ?", answer: "Dans votre tableau de bord, allez dans 'Mes annonces', cliquez sur l'annonce concernée et choisissez Modifier ou Supprimer.", category: "annonces", sort_order: 8 },
//   { question: "Comment retirer mes gains ?", answer: "Allez dans Portefeuille > Retrait, choisissez votre moyen de paiement (Flooz, TMoney, Mobile Money) et entrez le montant. Le minimum est de 1 000 FCFA.", category: "paiements", sort_order: 9 },
//   { question: "Comment signaler une annonce suspecte ?", answer: "Sur la page de l'annonce, cliquez sur 'Signaler' et sélectionnez le motif. Notre équipe examinera le signalement dans les 24h.", category: "securite", sort_order: 10 },
//   { question: "Puis-je utiliser TG-Market en dehors du Togo ?", answer: "TG-Market est actuellement disponible uniquement au Togo. Nous prévoyons d'élargir à d'autres pays d'Afrique de l'Ouest prochainement.", category: "generale", sort_order: 11 },
//   { question: "Comment contacter le support ?", answer: "Envoyez-nous un email à support@tgmarket.tg ou utilisez la page Contact. Nous répondons sous 24h.", category: "generale", sort_order: 12 },
// ];

// async function main() {
//   console.log('🌱 Seeding database...');

//   // 1. Admin user
//   const adminPassword = await bcrypt.hash('Admin@TGMarket2026', 12);
//   await prisma.user.upsert({
//     where: { email: 'admin@tgmarket.tg' },
//     update: {},
//     create: {
//       first_name: 'Admin',
//       last_name: 'TG-Market',
//       email: 'admin@tgmarket.tg',
//       phone: '+22890000000',
//       password: adminPassword,
//       city: 'Lomé',
//       role: 'admin',
//       email_verified_at: new Date(),
//       phone_verified_at: new Date(),
//     },
//   });
//   console.log('✓ Admin user created');

//   // 2. Mega-categories (parents)
//   for (const cat of megaCategories) {
//     await prisma.category.upsert({
//       where: { slug: cat.slug },
//       update: { name: cat.name, icon: cat.icon, color: cat.color, sort_order: cat.sort_order },
//       create: cat,
//     });
//   }
//   console.log(`✓ ${megaCategories.length} mega-categories seeded`);

//   // 3. Sub-categories (children)
//   for (const sub of subCategories) {
//     const parent = await prisma.category.findUnique({ where: { slug: sub.parentSlug } });
//     if (!parent) {
//       console.warn(`⚠ Parent not found for slug "${sub.parentSlug}", skipping "${sub.name}"`);
//       continue;
//     }
//     const { parentSlug, ...data } = sub;
//     await prisma.category.upsert({
//       where: { slug: data.slug },
//       update: { ...data, parent_id: parent.id },
//       create: { ...data, parent_id: parent.id },
//     });
//   }
//   console.log(`✓ ${subCategories.length} sub-categories seeded`);

//   // 4. FAQs
//   await prisma.faq.deleteMany({});
//   for (const faq of faqs) {
//     await prisma.faq.create({ data: faq });
//   }
//   console.log(`✓ ${faqs.length} FAQs seeded`);

//   console.log('🌱 Seed completed!');
// }

// main()
//   .catch((e) => {
//     console.error('Seed error:', e);
//     process.exit(1);
//   })
//   .finally(() => prisma.$disconnect());
// prisma/seed.js
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// ✅ FORCER l'utilisation de DATABASE_URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// ... le reste de votre code reste identique ...

// Mega-catégories (parents)
const megaCategories = [
  { name: "Multimédia", slug: "multimedia", icon: "Smartphone", color: "#3B82F6", sort_order: 1 },
  // ... etc (gardez votre code existant)
];

// ... tout le reste du code reste le même ...

async function main() {
  console.log('🌱 Seeding database...');
  console.log('📡 Connexion à:', process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@'));

  try {
    // Tester la connexion d'abord
    await prisma.$connect();
    console.log('✅ Connexion réussie !');

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
    console.log('✅ Admin user created');

    // 2. Mega-categories (parents)
    for (const cat of megaCategories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, icon: cat.icon, color: cat.color, sort_order: cat.sort_order },
        create: cat,
      });
    }
    console.log(`✅ ${megaCategories.length} mega-categories seeded`);

    // 3. Sub-categories (children)
    for (const sub of subCategories) {
      const parent = await prisma.category.findUnique({ where: { slug: sub.parentSlug } });
      if (!parent) {
        console.warn(`⚠️ Parent not found for slug "${sub.parentSlug}", skipping "${sub.name}"`);
        continue;
      }
      const { parentSlug, ...data } = sub;
      await prisma.category.upsert({
        where: { slug: data.slug },
        update: { ...data, parent_id: parent.id },
        create: { ...data, parent_id: parent.id },
      });
    }
    console.log(`✅ ${subCategories.length} sub-categories seeded`);

    // 4. FAQs
    await prisma.faq.deleteMany({});
    for (const faq of faqs) {
      await prisma.faq.create({ data: faq });
    }
    console.log(`✅ ${faqs.length} FAQs seeded`);

    console.log('🌱 Seed completed!');
  } catch (error) {
    console.error('❌ Erreur pendant le seed:', error.message);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());