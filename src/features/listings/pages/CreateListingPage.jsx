import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Eye,
  Send,
  CheckCircle2,
  Share2,
  ExternalLink,
  MessageCircle,
  Link2,
  Copy,
  MapPin,
  Smartphone,
  Car,
  Laptop,
  Sofa,
  Shirt,
  Home,
  Refrigerator,
  Gamepad2,
  Dumbbell,
  Sparkles,
  Baby,
  Apple,
  Briefcase,
  PawPrint,
  BookOpen,
  Music,
  Palette,
  TreePine,
  Wrench,
  Package,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Textarea from "@/shared/ui/Textarea";
import Select from "@/shared/ui/Select";
import StepIndicator from "@/shared/ui/StepIndicator";
import ListingFormStep from "@/features/listings/components/ListingFormStep";
import PhotoUploader from "@/features/listings/components/PhotoUploader";
import ListingPreview from "@/features/listings/components/ListingPreview";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useCreateProduct } from "@/features/products/hooks/useProducts";
import api from "@/shared/services/api";
import { CITIES, PRODUCT_CONDITIONS, MAX_IMAGES_PER_LISTING } from "@/shared/constants";
import { createListingSchema } from "@/shared/utils/validators";

const WIZARD_STEPS = [
  { label: "Catégorie", icon: "📁" },
  { label: "Infos", icon: "📝" },
  { label: "Photos", icon: "📷" },
  { label: "Prix", icon: "💰" },
  { label: "Lieu", icon: "📍" },
  { label: "Aperçu", icon: "👁️" },
  { label: "Publier", icon: "🚀" },
];

const defaultFormValues = {
  title: "",
  description: "",
  price: "",
  negotiable: false,
  category: "",
  condition: "",
  city: "",
  neighborhood: "",
  brand: "",
  images: [],
  deliveryAvailable: false,
  deliveryPrice: "",
};

export default function CreateListingPage() {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const [currentStep, setCurrentStep] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [publishedProductId, setPublishedProductId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createListingSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
  });

  const formValues = watch();

  async function uploadImages(files) {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const res = await api.post("/upload/images", formData);
    return res.data.data.map((img) => img.url);
  }

  const validateStep = useCallback(
    async (step) => {
      switch (step) {
        case 0:
          if (!selectedCategory) {
            toast.error("Veuillez sélectionner une catégorie");
            return false;
          }
          return true;
        case 1:
          return await trigger(["title", "description", "condition"]);
        case 2:
          if (photos.length === 0) {
            toast.error("Ajoutez au moins une photo");
            return false;
          }
          return true;
        case 3:
          return await trigger(["price"]);
        case 4:
          return await trigger(["city"]);
        default:
          return true;
      }
    },
    [selectedCategory, photos.length, trigger]
  );

  const handleNext = useCallback(async () => {
    const valid = await validateStep(currentStep);
    if (valid && currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, validateStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const handlePublish = useCallback(async () => {
    if (!selectedCategory) {
      toast.error("Veuillez sélectionner une catégorie");
      return;
    }
    if (photos.length === 0) {
      toast.error("Ajoutez au moins une photo");
      return;
    }

    setIsSubmitting(true);
    try {
      const filesToUpload = photos.filter((p) => p.file).map((p) => p.file);
      const existingUrls = photos.filter((p) => !p.file).map((p) => p.url);

      let uploadedUrls = [];
      if (filesToUpload.length > 0) {
        uploadedUrls = await uploadImages(filesToUpload);
      }

      const allImages = [...existingUrls, ...uploadedUrls];

      const payload = {
        categoryId: selectedCategory.id,
        title: formValues.title,
        description: formValues.description,
        condition: formValues.condition,
        brand: formValues.brand || undefined,
        tags: formValues.tags || [],
        images: allImages,
        price: Math.round(Number(formValues.price)),
        negotiable: formValues.negotiable,
        deliveryAvailable: formValues.deliveryAvailable,
        deliveryPrice: formValues.deliveryAvailable
          ? Math.round(Number(formValues.deliveryPrice) || 0) || undefined
          : undefined,
        city: formValues.city,
        neighborhood: formValues.neighborhood || undefined,
      };

      const result = await createProduct.mutateAsync(payload);
      setPublishedProductId(result?.id);
      setIsPublished(true);
      toast.success("Votre annonce a été publiée !");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Erreur lors de la publication";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedCategory, photos, formValues, createProduct]);

  const handleSaveDraft = useCallback(() => {
    toast.success("Brouillon sauvegardé !");
  }, []);

  const handleShare = useCallback((platform) => {
    toast.success(`Partage via ${platform} !`);
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ListingFormStep
            title="Choisissez une catégorie"
            description="Sélectionnez la catégorie qui correspond le mieux à votre article"
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {categories.map((cat) => {
                const Icon = getIconComponent(cat.icon);
                const isSelected = selectedCategory?.id === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setValue("category", cat.slug);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl  p-4 text-center transition-all",
                      isSelected
                        ? "border-brand-800 bg-brand-50 shadow-md shadow-brand-800/10 dark:bg-brand-800/10"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
                    )}
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: cat.color + "15" }}
                    >
                      {Icon && <Icon className="h-6 w-6" style={{ color: cat.color }} />}
                    </div>
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {cat.name}
                    </span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-800"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </ListingFormStep>
        );

      case 1:
        return (
          <ListingFormStep
            title="Informations sur l'article"
            description="Décrivez votre article en détail pour attirer l'attention des acheteurs"
          >
            <div className="space-y-5">
              <Input
                label="Titre de l'annonce"
                placeholder="Ex: iPhone 15 Pro Max 256Go"
                error={errors.title?.message}
                {...register("title")}
              />

              <Textarea
                label="Description"
                placeholder="Décrivez votre article en détail : état, marque, modèle, raison de la vente..."
                rows={5}
                maxLength={5000}
                showCount
                error={errors.description?.message}
                {...register("description")}
              />

              <Select
                label="État de l'article"
                placeholder="Sélectionnez l'état"
                options={PRODUCT_CONDITIONS.map((c) => ({
                  value: c.value,
                  label: c.label,
                }))}
                value={formValues.condition}
                onChange={(val) => setValue("condition", val)}
                error={errors.condition?.message}
              />

              <Input
                label="Marque (optionnel)"
                placeholder="Ex: Apple, Samsung, Nike..."
                {...register("brand")}
              />

              <Input
                label="Tags (optionnel)"
                placeholder="Ex: iphone, smartphone, apple (séparés par des virgules)"
                helperText="Ajoutez des mots-clés pour faciliter la recherche"
                {...register("tags", {
                  setValueAs: (v) =>
                    v
                      ? v.split(",").map((t) => t.trim()).filter(Boolean)
                      : [],
                })}
              />
            </div>
          </ListingFormStep>
        );

      case 2:
        return (
          <ListingFormStep
            title="Ajoutez des photos"
            description={`Ajoutez jusqu'à ${MAX_IMAGES_PER_LISTING} photos. La première sera la photo principale.`}
          >
            <PhotoUploader
              photos={photos}
              onPhotosChange={setPhotos}
              maxPhotos={MAX_IMAGES_PER_LISTING}
              error={errors.images?.message}
            />
          </ListingFormStep>
        );

      case 3:
        return (
          <ListingFormStep
            title="Prix & Livraison"
            description="Définissez le prix et les options de livraison"
          >
            <div className="space-y-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prix (FCFA) <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="0"
                    required
                    className={cn(
                      "w-full rounded-xl border bg-white py-2.5 pl-4 pr-24 text-lg font-bold text-gray-900 transition-colors",
                      "placeholder:text-gray-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20",
                      "dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500",
                      errors.price
                        ? "border-red-700"
                        : "border-gray-300 dark:border-gray-700"
                    )}
                    {...register("price", {
                      valueAsNumber: true,
                      setValueAs: (v) => {
                        if (v === "" || v === null || v === undefined) return NaN;
                        const n = Number(String(v).replace(/[^0-9]/g, ""));
                        return isNaN(n) ? NaN : n;
                      },
                    })}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
                    FCFA
                  </span>
                </div>
                {errors.price && (
                  <p className="mt-1.5 text-xs text-red-700">{errors.price.message}</p>
                )}
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Prix négociable
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Permet aux acheteurs de faire des offres
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formValues.negotiable}
                  onClick={() => setValue("negotiable", !formValues.negotiable)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
                    formValues.negotiable ? "bg-brand-800" : "bg-gray-300 dark:bg-gray-600"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200",
                      formValues.negotiable ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Livraison disponible
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Proposez la livraison à l'acheteur
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formValues.deliveryAvailable}
                  onClick={() => setValue("deliveryAvailable", !formValues.deliveryAvailable)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
                    formValues.deliveryAvailable
                      ? "bg-brand-800"
                      : "bg-gray-300 dark:bg-gray-600"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200",
                      formValues.deliveryAvailable ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </label>

              <AnimatePresence>
                {formValues.deliveryAvailable && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Input
                      label="Frais de livraison (FCFA)"
                      placeholder="0"
                      type="text"
                      inputMode="numeric"
                      {...register("deliveryPrice", {
                        valueAsNumber: true,
                        setValueAs: (v) => {
                          if (v === "" || v === null || v === undefined) return 0;
                          const n = Number(String(v).replace(/[^0-9]/g, ""));
                          return isNaN(n) ? 0 : n;
                        },
                      })}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ListingFormStep>
        );

      case 4:
        return (
          <ListingFormStep
            title="Localisation"
            description="Indiquez où se trouve votre article"
          >
            <div className="space-y-5">
              <Select
                label="Ville"
                placeholder="Sélectionnez une ville"
                options={CITIES.map((c) => ({ value: c, label: c }))}
                value={formValues.city}
                onChange={(val) => setValue("city", val)}
                error={errors.city?.message}
              />

              <Input
                label="Quartier / Quartier (optionnel)"
                placeholder="Ex: Agbalepedogan, Bè Kpota..."
                leftIcon={MapPin}
                {...register("neighborhood")}
              />

              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex h-48 items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
                    <p className="mt-2 text-sm text-gray-400">
                      {formValues.city
                        ? `${formValues.city}${formValues.neighborhood ? `, ${formValues.neighborhood}` : ""}`
                        : "Sélectionnez une ville pour afficher la carte"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ListingFormStep>
        );

      case 5:
        return (
          <ListingFormStep
            title="Aperçu de votre annonce"
            description="Vérifiez que toutes les informations sont correctes avant de publier"
          >
            <ListingPreview
              data={{
                ...formValues,
                category: selectedCategory?.name || "",
                images: photos,
                tags: formValues.tags || [],
              }}
            />
          </ListingFormStep>
        );

      case 6:
        return (
          <ListingFormStep>
            {isPublished ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-700/10"
                >
                  <CheckCircle2 className="h-12 w-12 text-brand-700" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  Votre annonce est en ligne !
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400"
                >
                  Félicitations ! Votre annonce est maintenant visible par des milliers
                  d'acheteurs potentiels.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 flex flex-col gap-3 sm:flex-row"
                >
                  <Button
                    icon={Eye}
                    onClick={() => navigate(`/annonce/${publishedProductId}`)}
                  >
                    Voir l'annonce
                  </Button>
                  <Button
                    variant="outline"
                    icon={Share2}
                    onClick={() => handleShare("partage")}
                  >
                    Partager
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8"
                >
                  <p className="mb-3 text-xs font-medium text-gray-400">
                    Partager sur :
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleShare("Facebook")}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-800 text-white transition-transform hover:scale-110"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleShare("WhatsApp")}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-white transition-transform hover:scale-110"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleShare("lien")}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white transition-transform hover:scale-110"
                    >
                      <Link2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleShare("copier")}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-800 text-white transition-transform hover:scale-110"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-200 dark:bg-brand-800/10">
                  <Send className="h-12 w-12 text-brand-800" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Prêt à publier ?
                </h2>
                <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                  Votre annonce sera visible immédiatement après la publication.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    icon={Send}
                    size="lg"
                    onClick={handlePublish}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  >
                    {isSubmitting ? "Publication en cours..." : "Publier l'annonce"}
                  </Button>
                  <Button
                    variant="outline"
                    icon={Save}
                    onClick={handleSaveDraft}
                  >
                    Sauvegarder brouillon
                  </Button>
                </div>
              </div>
            )}
          </ListingFormStep>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-8xl px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nouvelle annonce
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Remplissez les informations pour publier votre annonce
          </p>
        </div>

        <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white px-4 py-5 dark:border-gray-800 dark:bg-gray-900">
          <StepIndicator steps={WIZARD_STEPS} currentStep={currentStep} />
        </div>

        <div className="min-h-[400px] rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>

        {currentStep < WIZARD_STEPS.length - 1 && (
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              icon={ChevronLeft}
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Retour
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                icon={Save}
                onClick={handleSaveDraft}
                className="hidden sm:inline-flex"
              >
                Brouillon
              </Button>

              {currentStep === WIZARD_STEPS.length - 2 ? (
                <Button icon={Eye} onClick={handleNext}>
                  Aperçu
                </Button>
              ) : (
                <Button icon={ChevronRight} iconPosition="right" onClick={handleNext}>
                  Suivant
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ICON_MAP = {
  Smartphone,
  Car,
  Laptop,
  Sofa,
  Shirt,
  Home,
  Refrigerator,
  Gamepad2,
  Dumbbell,
  Sparkles,
  Baby,
  Apple,
  Briefcase,
  PawPrint,
  BookOpen,
  Music,
  Palette,
  TreePine,
  Wrench,
  Package,
};

function getIconComponent(iconName) {
  return ICON_MAP[iconName] || Package;
}
