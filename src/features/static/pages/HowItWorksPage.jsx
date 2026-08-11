import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "@/shared/ui/Button";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

function StepImage({ src, alt, className = "" }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`object-cover ${className}`}
    />
  );
}

export default function HowItWorksPage() {
  const { siteName } = useSiteSettings();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-800 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_70%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <h1 className="text-4xl font-bold sm:text-5xl">Comment ça marche ?</h1>
            <p className="mt-4 text-lg text-white">
              {siteName}, l'application de seconde main au Togo.<br />
              Ton style, tes bonnes affaires — vends et achète d'occasion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ SELL ═══════════════ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} custom={0}>
            <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Vendre en 3 étapes
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-gray-500 dark:text-gray-400">
              Publie ton annonce en quelques minutes et commence à vendre.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
                title: "Télécharge l'appli",
                desc: "Installe l'app sur iOS ou Android et crée ton profil en 1 minute. Active la vérification pour obtenir le badge « Profil vérifié » (ID + selfie) et inspirer confiance dès le premier échange.",
              },
              {
                step: "02",
                image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
                title: "Prends en photo, décris-le",
                desc: "Des photos nettes sous plusieurs angles + une description honnête (état, marque, taille, défauts éventuels). Plus c'est clair, plus ça part vite !",
              },
              {
                step: "03",
                image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
                title: "Super, ton annonce est en ligne !",
                desc: "Elle apparaît dans le fil autour de toi. Les acheteurs te font des offres, c'est toi qui décide d'accepter ou de refuser.",
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} custom={i + 1} className="relative  bg-white p-6  transition-shadow  dark:border-gray-800 dark:bg-gray-800">
                <span className="absolute -top-3 left-6 rounded-full bg-brand-800 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  {item.step}
                </span>
                <div className="mb-4 mt-2 h-64 w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                  <StepImage src={item.image} alt={item.title} className="h-full w-full" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ VALIDATE & CONCLUDE ═══════════════ */}
      <section className="bg-white px-4 py-16 dark:bg-gray-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Valide et conclus l'échange
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-12 grid gap-8 md:grid-cols-2">
            <motion.div variants={fadeUp} custom={0} className="overflow-hidden rounded-2xl  bg-white  dark:bg-gray-800">
              <div className="h-64 overflow-hidden bg-brand-50 dark:bg-brand-900/10">
                <StepImage
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop"
                  alt="Colis préparé pour l'expédition"
                  className="h-full w-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vendu !</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  Prépare soigneusement ton colis. Le paiement est sécurisé et les fonds ne sont libérés qu'après validation par l'acheteur.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={1} className="overflow-hidden rounded-2xl bg-white  dark:bg-gray-800">
              <div className="h-64 overflow-hidden bg-brand-50 dark:bg-brand-900/10">
                <StepImage
                  src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=400&fit=crop"
                  alt="Livreur avec colis"
                  className="h-full w-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">C'est parti pour la remise</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  Tu as le choix : remise en main propre, RDV sécurisé chez un partenaire {siteName} (recommandé), ou la livraison.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ BUY ═══════════════ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Achète d'occasion en toute tranquillité
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-12 grid gap-8 md:grid-cols-2">
            <motion.div variants={fadeUp} custom={0} className="overflow-hidden rounded-2xl  bg-white  dark:border-gray-800 dark:bg-gray-800">
              <div className="h-64 overflow-hidden bg-brand-50 dark:bg-brand-900/10">
                <StepImage
                  src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=600&h=400&fit=crop"
                  alt="Personne qui fait ses courses"
                  className="h-full w-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Explore et découvre</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  Trouve les bonnes affaires près de toi, explore par catégories. Sauvegarde en favoris pour suivre tes coups de cœur.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={1} className="overflow-hidden rounded-2xl  bg-white  dark:border-gray-800 dark:bg-gray-800">
              <div className="h-64 overflow-hidden bg-purple-50 dark:bg-purple-900/10">
                <StepImage
                  src="https://images.unsplash.com/photo-1760360497581-0606569510a6?w=600&h=400&fit=crop"
                  alt="Conversation de chat sur téléphone"
                  className="h-full w-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chat + Offre / Achat</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  Pose tes questions, fais une offre ou clique sur « Acheter ». Ton paiement est protégé jusqu'à la validation du QR Code.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ DELIVERY MODES ═══════════════ */}
      <section className=" px-4 py-16 dark:bg-gray-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Plusieurs modes de remise
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-gray-500 dark:text-gray-400">
              Choisis le mode qui te convient le mieux.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
                title: "RDV sécurisés",
                desc: `Un partenaire ${siteName} accueille l'échange : environnement sûr, validation QR Code, sérénité maximale !`,
                border: "border-brand-200 dark:border-brand-800/30",
              },
              {
                image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=400&fit=crop",
                title: "Livraison",
                desc: "Pratique si tu ne peux pas te déplacer. Le paiement reste protégé jusqu'à confirmation de réception.",
                border: "border-blue-200 dark:border-blue-800/30",
              },
              {
                image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop",
                title: "Remise en main propre",
                desc: "Rencontre près de chez toi, scanne le QR Code et c'est réglé. Idéal pour tester un article sur place.",
                border: "border-brand-200 dark:border-brand-800/30",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className={`overflow-hidden rounded-2xl  bg-white  transition-shadow  dark:bg-gray-800 ${item.border}`}
              >
                <div className="h-64 overflow-hidden bg-gray-100 dark:bg-gray-700/30">
                  <StepImage src={item.image} alt={item.title} className="h-full w-full" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ QR CODE EXPLANATION ═══════════════ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="overflow-hidden rounded-2xl border border-brand-200 bg-brand-50 text-center dark:border-brand-800/30 dark:bg-brand-900/10"
          >
            <div className="h-72 overflow-hidden bg-brand-100/50 dark:bg-brand-900/20">
              <StepImage
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop"
                alt="Scan de QR Code pour validation"
                className="h-full w-full"
              />
            </div>
            <div className="px-8 pb-8 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">La validation QR Code</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                À chaque rencontre, l'acheteur génère un QR code dans la messagerie que le vendeur doit scanner.
                Ce scan valide la transaction — il enregistre l'horodatage, le lieu et les identités des parties.
                C'est ta preuve de sécurité et la clé pour débloquer le paiement.
              </p>
              <p className="mt-3 text-sm font-medium text-brand-800 dark:text-brand-400">
                Sans scan QR, l'échange n'est pas sécurisé par {siteName}.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="bg-brand-800 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl font-bold sm:text-4xl">Prêt à commencer ?</h2>
            <p className="mt-4 text-lg text-white/80">
              Rejoins la communauté {siteName} et trouve de bonnes affaires près de chez toi.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/inscription">
                <Button size="lg" className="bg-white text-brand-700 hover:bg-gray-100">
                  Créer un compte gratuit
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Explorer les annonces
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
