import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Eye,
  CheckCircle2,
  MapPin,
  Trash2,
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
import { mockCategories } from "@/data/categories";
import { mockProducts } from "@/data/products";
import { CITIES, PRODUCT_CONDITIONS, MAX_IMAGES_PER_LISTING } from "@/shared/constants";
import { createListingSchema } from "@/shared/utils/validators";

const WIZARD_STEPS = [
  { label: "Catégorie", icon: "📁" },
  { label: "Infos", icon: "📝" },
  { label: "Photos", icon: "📷" },
  { label: "Prix", icon: "💰" },
  { label: "Lieu", icon: "📍" },
  { label: "Aperçu", icon: "👁️" },
  { label: "Sauvegarder", icon: "💾" },
];

function getIconComponent(iconName) {
  const ICON_MAP = {
    Smartphone: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" />
      </svg>
    ),
    Car: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" />
      </svg>
    ),
  };
  return ICON_MAP[iconName] || ((props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  ));
}

export default function EditListingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const existingProduct = mockProducts.find((p) => p.id === Number(id));

  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createListingSchema),
    mode: "onChange",
  });

  const formValues = watch();

  useEffect(() => {
    if (existingProduct) {
      const cat = mockCategories.find((c) => c.name === existingProduct.category);
      if (cat) setSelectedCategory(cat);

      const productPhotos = existingProduct.images.map((url, i) => ({
        id: `existing-${i}`,
        url,
        name: `Photo ${i + 1}`,
      }));
      setPhotos(productPhotos);

      setValue("title", existingProduct.title);
      setValue("description", existingProduct.description);
      setValue("price", existingProduct.price);
      setValue("negotiable", existingProduct.negotiable);
      setValue("condition", PRODUCT_CONDITIONS.find((c) => c.label === existingProduct.condition)?.value || "good");
      setValue("city", existingProduct.city);
      setValue("neighborhood", existingProduct.neighborhood || "");
      setValue("brand", existingProduct.brand || "");
      setValue("deliveryAvailable", existingProduct.deliveryAvailable);
      setValue("deliveryPrice", existingProduct.deliveryPrice || "");
      setValue("tags", existingProduct.tags?.join(", ") || "");
    }
  }, [existingProduct, setValue]);

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

  const handleSave = useCallback(() => {
    setIsSaved(true);
    toast.success("Annonce mise à jour avec succès !");
  }, []);

  const handleDelete = useCallback(() => {
    setIsDeleting(true);
    toast.success("Annonce supprimée");
    setTimeout(() => navigate("/listings"), 1000);
  }, [navigate]);

  if (!existingProduct) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Annonce introuvable
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Cette annonce n'existe pas ou a été supprimée.
          </p>
          <Button className="mt-6" onClick={() => navigate("/listings")}>
            Retour aux annonces
          </Button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ListingFormStep
            title="Catégorie"
            description="Modifiez la catégorie de votre annonce"
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {mockCategories.map((cat) => {
                const Icon = getIconComponent(cat.icon);
                const isSelected = selectedCategory?.id === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all",
                      isSelected
                        ? "border-red-800 bg-red-50 shadow-md shadow-red-800/10 dark:bg-red-800/10"
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
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-red-800"
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
            title="Informations"
            description="Modifiez les informations de votre article"
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
                placeholder="Décrivez votre article..."
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
            title="Photos"
            description={`Modifiez les photos de votre annonce (max. ${MAX_IMAGES_PER_LISTING})`}
          >
            <PhotoUploader
              photos={photos}
              onPhotosChange={setPhotos}
              maxPhotos={MAX_IMAGES_PER_LISTING}
            />
          </ListingFormStep>
        );

      case 3:
        return (
          <ListingFormStep
            title="Prix & Livraison"
            description="Modifiez le prix et les options de livraison"
          >
            <div className="space-y-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prix (FCFA)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    className={cn(
                      "w-full rounded-xl border bg-white py-2.5 pl-4 pr-24 text-lg font-bold text-gray-900 transition-colors",
                      "placeholder:text-gray-400 focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-800/20",
                      "dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500",
                      errors.price
                        ? "border-red-700"
                        : "border-gray-300 dark:border-gray-700"
                    )}
                    {...register("price", { valueAsNumber: true })}
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
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Prix négociable</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Permet aux acheteurs de faire des offres</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formValues.negotiable}
                  onClick={() => setValue("negotiable", !formValues.negotiable)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
                    formValues.negotiable ? "bg-red-800" : "bg-gray-300 dark:bg-gray-600"
                  )}
                >
                  <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200", formValues.negotiable ? "translate-x-6" : "translate-x-1")} />
                </button>
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Livraison disponible</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Proposez la livraison à l'acheteur</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formValues.deliveryAvailable}
                  onClick={() => setValue("deliveryAvailable", !formValues.deliveryAvailable)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
                    formValues.deliveryAvailable ? "bg-red-800" : "bg-gray-300 dark:bg-gray-600"
                  )}
                >
                  <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200", formValues.deliveryAvailable ? "translate-x-6" : "translate-x-1")} />
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
                      type="number"
                      {...register("deliveryPrice", { valueAsNumber: true })}
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
            description="Modifiez la localisation de votre article"
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
                label="Quartier (optionnel)"
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
            title="Aperçu"
            description="Vérifiez les modifications avant de sauvegarder"
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
            {isSaved ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-700/10"
                >
                  <CheckCircle2 className="h-12 w-12 text-green-700" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  Modifications enregistrées !
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400"
                >
                  Votre annonce a été mise à jour avec succès.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 flex flex-col gap-3 sm:flex-row"
                >
                  <Button icon={Eye} onClick={() => navigate(`/listings/${id}`)}>
                    Voir l'annonce
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/listings")}
                  >
                    Retour aux annonces
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-200 dark:bg-red-800/10">
                  <Save className="h-12 w-12 text-red-800" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Enregistrer les modifications ?
                </h2>
                <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                  Les modifications seront appliquées immédiatement à votre annonce.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button icon={Save} size="lg" onClick={handleSave}>
                    Enregistrer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/listings/${id}`)}
                  >
                    Annuler
                  </Button>
                </div>

                <div className="mt-10 border-t border-gray-100 pt-8 dark:border-gray-800">
                  <p className="mb-3 text-xs font-medium text-gray-400">Zone de danger</p>
                  <Button
                    variant="danger"
                    icon={Trash2}
                    loading={isDeleting}
                    onClick={handleDelete}
                  >
                    Supprimer l'annonce
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
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Modifier l'annonce
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {existingProduct.title}
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
