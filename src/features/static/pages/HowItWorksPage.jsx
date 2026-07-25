import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "@/shared/ui/Button";
import {
  PhoneDownloadSvg,
  CameraPhotoSvg,
  AdOnlineSvg,
  SoldPackageSvg,
  DeliveryOptionsSvg,
  QrCodeScanSvg,
  ExploreSearchSvg,
  ChatOfferSvg,
  RdvsSvg,
  HandToHandSvg,
} from "../components/HowItWorksIllustrations";

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

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-yellow-600 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_70%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <h1 className="text-4xl font-bold sm:text-5xl">Comment ça marche ?</h1>
            <p className="mt-4 text-lg text-white/80">
              AK Market, l'application de seconde main au Togo.<br />
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
                Illustration: PhoneDownloadSvg,
                title: "Télécharge l'appli",
                desc: "Installe l'app sur iOS ou Android et crée ton profil en 1 minute. Active la vérification pour obtenir le badge « Profil vérifié » (ID + selfie) et inspirer confiance dès le premier échange.",
                bgColor: "bg-yellow-50 dark:bg-yellow-900/10",
              },
              {
                step: "02",
                Illustration: CameraPhotoSvg,
                title: "Prends en photo, décris-le",
                desc: "Des photos nettes sous plusieurs angles + une description honnête (état, marque, taille, défauts éventuels). Plus c'est clair, plus ça part vite !",
                bgColor: "bg-amber-50 dark:bg-amber-900/10",
              },
              {
                step: "03",
                Illustration: AdOnlineSvg,
                title: "Super, ton annonce est en ligne !",
                desc: "Elle apparaît dans le fil autour de toi. Les acheteurs te font des offres, c'est toi qui décide d'accepter ou de refuser.",
                bgColor: "bg-green-50 dark:bg-green-900/10",
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} custom={i + 1} className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                <span className="absolute -top-3 left-6 rounded-full bg-yellow-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  {item.step}
                </span>
                <div className={`mb-4 mt-2 flex h-64 w-full items-center justify-center rounded-xl ${item.bgColor}`}>
                  <item.Illustration className="h-56 w-56" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ VALIDATE & CONCLUDE ═══════════════ */}
      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Valide et conclus l'échange
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-12 grid gap-8 md:grid-cols-2">
            <motion.div variants={fadeUp} custom={0} className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-800">
              <div className="flex h-64 items-center justify-center bg-green-50 dark:bg-green-900/10">
                <SoldPackageSvg className="h-56 w-56" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vendu !</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  Prépare soigneusement ton colis. Le paiement est sécurisé et les fonds ne sont libérés qu'après validation par l'acheteur.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={1} className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-800">
              <div className="flex h-64 items-center justify-center bg-yellow-50 dark:bg-yellow-900/10">
                <DeliveryOptionsSvg className="h-56 w-56" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">C'est parti pour la remise</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  Tu as le choix : remise en main propre, RDV sécurisé chez un partenaire AK Market (recommandé), ou la livraison.
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
            <motion.div variants={fadeUp} custom={0} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex h-64 items-center justify-center bg-yellow-50 dark:bg-yellow-900/10">
                <ExploreSearchSvg className="h-56 w-56" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Explore et découvre</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  Trouve les bonnes affaires près de toi, explore par catégories. Sauvegarde en favoris pour suivre tes coups de cœur.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={1} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex h-64 items-center justify-center bg-purple-50 dark:bg-purple-900/10">
                <ChatOfferSvg className="h-56 w-56" />
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
      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-900 sm:px-6 lg:px-8">
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
                Illustration: RdvsSvg,
                title: "RDV sécurisés",
                desc: "Un partenaire AK Market accueille l'échange : environnement sûr, validation QR Code, sérénité maximale !",
                border: "border-green-200 dark:border-green-800/30",
              },
              {
                Illustration: DeliveryOptionsSvg,
                title: "Livraison",
                desc: "Pratique si tu ne peux pas te déplacer. Le paiement reste protégé jusqu'à confirmation de réception.",
                border: "border-blue-200 dark:border-blue-800/30",
              },
              {
                Illustration: HandToHandSvg,
                title: "Remise en main propre",
                desc: "Rencontre près de chez toi, scanne le QR Code et c'est réglé. Idéal pour tester un article sur place.",
                border: "border-amber-200 dark:border-amber-800/30",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800 ${item.border}`}
              >
                <div className="flex h-64 items-center justify-center bg-gray-50 dark:bg-gray-700/30">
                  <item.Illustration className="h-56 w-56" />
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
            className="overflow-hidden rounded-2xl border border-yellow-200 bg-yellow-50 text-center dark:border-yellow-800/30 dark:bg-yellow-900/10"
          >
            <div className="flex items-center justify-center bg-yellow-100/50 py-10 dark:bg-yellow-900/20">
              <QrCodeScanSvg className="h-64 w-64" />
            </div>
            <div className="px-8 pb-8 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">La validation QR Code</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                À chaque rencontre, l'acheteur génère un QR code dans la messagerie que le vendeur doit scanner.
                Ce scan valide la transaction — il enregistre l'horodatage, le lieu et les identités des parties.
                C'est ta preuve de sécurité et la clé pour débloquer le paiement.
              </p>
              <p className="mt-3 text-sm font-medium text-yellow-800 dark:text-yellow-400">
                Sans scan QR, l'échange n'est pas sécurisé par AK Market.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="bg-yellow-600 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl font-bold sm:text-4xl">Prêt à commencer ?</h2>
            <p className="mt-4 text-lg text-white/80">
              Rejoins la communauté AK Market et trouve de bonnes affaires près de chez toi.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/inscription">
                <Button size="lg" className="bg-white text-yellow-700 hover:bg-gray-100">
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
